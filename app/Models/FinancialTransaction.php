<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FinancialTransaction extends Model
{
    protected $table = 'financial_transactions';

    protected $fillable = [
        'transaction_code',
        'type',
        'category',
        'amount',
        'description',
        'reference_type',
        'reference_id',
        'transaction_date',
        'payment_method',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'transaction_date' => 'date',
        ];
    }
}
