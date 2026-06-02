<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('tracking_code', 20)->unique();
            $table->foreignId('customer_id')->constrained()->cascadeOnDelete();
            $table->foreignId('laptop_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('service_category_id')->constrained()->restrictOnDelete();
            $table->string('laptop_model')->nullable();
            $table->string('laptop_serial')->nullable();
            $table->text('issue_description');
            $table->text('diagnosis')->nullable();
            $table->enum('status', ['received', 'diagnosed', 'in_progress', 'waiting_parts', 'waiting_approval', 'repaired', 'pickup_ready', 'completed', 'cancelled'])->default('received');
            $table->decimal('estimated_cost', 15, 2)->nullable();
            $table->decimal('final_cost', 15, 2)->nullable();
            $table->decimal('down_payment', 15, 2)->nullable();
            $table->date('pickup_date')->nullable();
            $table->date('completion_date')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
