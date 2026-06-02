<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Service extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'tracking_code',
        'customer_id',
        'laptop_id',
        'service_category_id',
        'laptop_model',
        'laptop_serial',
        'issue_description',
        'diagnosis',
        'status',
        'estimated_cost',
        'final_cost',
        'down_payment',
        'pickup_date',
        'completion_date',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'estimated_cost' => 'decimal:2',
            'final_cost' => 'decimal:2',
            'down_payment' => 'decimal:2',
            'pickup_date' => 'date',
            'completion_date' => 'date',
        ];
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function laptop(): BelongsTo
    {
        return $this->belongsTo(Laptop::class);
    }

    public function serviceCategory(): BelongsTo
    {
        return $this->belongsTo(ServiceCategory::class, 'service_category_id');
    }

    public function category(): BelongsTo
    {
        return $this->serviceCategory();
    }

    public function updates(): HasMany
    {
        return $this->hasMany(ServiceUpdate::class);
    }

    public function parts(): HasMany
    {
        return $this->hasMany(ServicePart::class);
    }

    public function photos(): HasMany
    {
        return $this->hasMany(ServicePhoto::class);
    }
}
