<?php

namespace App\Services;

use App\Models\FinancialTransaction;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

/**
 * @extends BaseService<FinancialTransaction>
 */
class TransactionService extends BaseService
{
    /**
     * Get the model class name.
     *
     * @return class-string<FinancialTransaction>
     */
    protected function model(): string
    {
        return FinancialTransaction::class;
    }

    /**
     * Get all transactions with pagination.
     */
    public function getAllTransactions(): LengthAwarePaginator
    {
        $query = FinancialTransaction::query();

        if ($search = request('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('transaction_code', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('notes', 'like', "%{$search}%");
            });
        }

        if ($type = request('type')) {
            $query->where('type', $type);
        }

        return QueryBuilder::for($query)
            ->allowedFilters([
                AllowedFilter::partial('transaction_code'),
                AllowedFilter::partial('description'),
                AllowedFilter::exact('type'),
                AllowedFilter::exact('payment_method'),
                AllowedFilter::exact('category'),
            ])
            ->allowedSorts(['transaction_code', 'amount', 'transaction_date', 'created_at', 'type'])
            ->defaultSort('-transaction_date')
            ->paginate(10)
            ->withQueryString();
    }

    /**
     * Generate a unique transaction code.
     */
    public function generateTransactionCode(): string
    {
        do {
            $code = 'TXN-'.now()->format('Ymd').'-'.strtoupper(bin2hex(random_bytes(2)));
        } while (FinancialTransaction::where('transaction_code', $code)->exists());

        return $code;
    }

    /**
     * Hook: Auto-generate transaction code before storing.
     */
    protected function beforeStore(array &$data): void
    {
        $data['transaction_code'] = $this->generateTransactionCode();
    }
}
