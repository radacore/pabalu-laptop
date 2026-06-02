<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Laptop extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'brand_id',
        'laptop_source_id',
        'model_name',
        'serial_number',
        'condition',
        'status',
        'purchase_price',
        'selling_price',
        'purchase_date',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'purchase_price' => 'decimal:2',
            'selling_price' => 'decimal:2',
            'purchase_date' => 'date',
        ];
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    public function laptopSource(): BelongsTo
    {
        return $this->belongsTo(LaptopSource::class);
    }

    public function specs(): HasOne
    {
        return $this->hasOne(LaptopSpec::class);
    }

    public function photos(): HasMany
    {
        return $this->hasMany(LaptopPhoto::class);
    }

    public function services(): HasMany
    {
        return $this->hasMany(Service::class);
    }
}
