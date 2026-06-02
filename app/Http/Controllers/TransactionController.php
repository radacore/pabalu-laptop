<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTransactionRequest;
use App\Http\Requests\UpdateTransactionRequest;
use App\Models\FinancialTransaction;
use App\Services\TransactionService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct(
        protected TransactionService $transactionService
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $transactions = $this->transactionService->getAllTransactions();

        return Inertia::render('transaction/TransactionIndexPage', [
            'transactions' => $transactions,
            'state' => [
                'search' => request('search'),
                'sort' => request('sort'),
                'type' => request('type'),
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('transaction/TransactionCreatePage');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTransactionRequest $request): RedirectResponse
    {
        $this->transactionService->store($request->validated());

        return redirect()->route('transactions.index')
            ->with('success', __('Transaction created successfully.'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(FinancialTransaction $transaction): Response
    {
        return Inertia::render('transaction/TransactionEditPage', [
            'transaction' => $transaction,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTransactionRequest $request, FinancialTransaction $transaction): RedirectResponse
    {
        $this->transactionService->update($transaction, $request->validated());

        return redirect()->route('transactions.index')
            ->with('success', __('Transaction updated successfully.'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FinancialTransaction $transaction): RedirectResponse
    {
        try {
            $this->transactionService->destroy($transaction);

            return redirect()->route('transactions.index')
                ->with('success', __('Transaction deleted successfully.'));
        } catch (\Exception $e) {
            return redirect()->route('transactions.index')
                ->with('error', $e->getMessage());
        }
    }
}
