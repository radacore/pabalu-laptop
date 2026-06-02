<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('laptops', function (Blueprint $table) {
            $table->id();
            $table->foreignId('brand_id')->constrained()->cascadeOnDelete();
            $table->foreignId('laptop_source_id')->constrained()->cascadeOnDelete();
            $table->string('model_name');
            $table->string('serial_number')->nullable()->unique();
            $table->enum('condition', ['new', 'used', 'refurbished', 'for_parts'])->default('used');
            $table->enum('status', ['available', 'sold', 'in_service', 'lost', 'reserved'])->default('available');
            $table->decimal('purchase_price', 15, 2)->nullable();
            $table->decimal('selling_price', 15, 2)->nullable();
            $table->date('purchase_date')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('laptops');
    }
};
