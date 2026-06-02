<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LaptopPhoto extends Model
{
    protected $fillable = [
        'laptop_id',
        'photo_path',
        'is_primary',
    ];

    protected function casts(): array
    {
        return [
            'is_primary' => 'boolean',
        ];
    }

    public function laptop(): BelongsTo
    {
        return $this->belongsTo(Laptop::class);
    }
}
