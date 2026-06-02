<?php

namespace App\Http\Controllers;

use App\Models\FinancialTransaction;
use App\Models\Laptop;
use App\Models\Permission;
use App\Models\Role;
use App\Models\Service;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the dashboard page with business stats.
     */
    public function index(): Response
    {
        return Inertia::render('dashboard/DashboardPage', [
            'stats' => [
                'users' => User::count(),
                'roles' => Role::count(),
                'permissions' => Permission::count(),
                'total_laptops' => Laptop::count(),
                'in_stock_laptops' => Laptop::where('status', 'in_stock')->count(),
                'total_services' => Service::count(),
                'active_services' => Service::whereNotIn('status', ['completed', 'cancelled'])->count(),
                'pending_services' => Service::whereIn('status', ['received', 'diagnosed', 'waiting_approval'])->count(),
                'total_income' => FinancialTransaction::where('type', 'income')->sum('amount'),
                'total_expenses' => FinancialTransaction::where('type', 'expense')->sum('amount'),
            ],
            'recentServices' => Service::with(['customer', 'serviceCategory'])
                ->latest()
                ->take(5)
                ->get(),
            'recentTransactions' => FinancialTransaction::latest('transaction_date')
                ->take(5)
                ->get(),
            'chartData' => $this->getMonthlyChartData(),
        ]);
    }

    /**
     * Get monthly income/expense data for the last 12 months.
     *
     * @return array<int, array{name: string, income: int, expense: int}>
     */
    private function getMonthlyChartData(): array
    {
        $start = Carbon::now()->subMonths(11)->startOfMonth();

        $driver = DB::getDriverName();

        $monthExpr = $driver === 'sqlite'
            ? "strftime('%Y-%m', transaction_date)"
            : "DATE_FORMAT(transaction_date, '%Y-%m')";

        $rows = FinancialTransaction::select(
            DB::raw("{$monthExpr} as month"),
            'type',
            DB::raw('SUM(amount) as total'),
        )
            ->where('transaction_date', '>=', $start)
            ->groupBy('month', 'type')
            ->orderBy('month')
            ->get()
            ->groupBy('month');

        $data = [];
        $cursor = $start->copy();

        for ($i = 0; $i < 12; $i++) {
            $key = $cursor->format('Y-m');
            $monthRows = $rows->get($key, collect());

            $locale = Carbon::getLocale();
            Carbon::setLocale('id');
            $label = $cursor->translatedFormat('M');
            Carbon::setLocale($locale);

            $data[] = [
                'name' => $label,
                'income' => (int) ($monthRows->firstWhere('type', 'income')?->total ?? 0),
                'expense' => (int) ($monthRows->firstWhere('type', 'expense')?->total ?? 0),
            ];

            $cursor->addMonth();
        }

        return $data;
    }
}
