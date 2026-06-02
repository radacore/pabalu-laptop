<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('laptop_specs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('laptop_id')->constrained()->cascadeOnDelete();
            $table->string('processor')->nullable();
            $table->string('ram')->nullable();
            $table->string('storage')->nullable();
            $table->string('gpu')->nullable();
            $table->string('display')->nullable();
            $table->string('battery')->nullable();
            $table->string('os')->nullable();
            $table->string('color')->nullable();
            $table->string('year')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('laptop_specs');
    }
};
