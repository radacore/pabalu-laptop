<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('laptop_photos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('laptop_id')->constrained()->cascadeOnDelete();
            $table->string('photo_path');
            $table->boolean('is_primary')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('laptop_photos');
    }
};
