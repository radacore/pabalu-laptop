<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LaptopSpec extends Model
{
    protected $fillable = [
        'laptop_id',
        'processor',
        'ram',
        'storage',
        'gpu',
        'display',
        'battery',
        'os',
        'color',
        'year',
    ];

    public function laptop(): BelongsTo
    {
        return $this->belongsTo(Laptop::class);
    }
}
