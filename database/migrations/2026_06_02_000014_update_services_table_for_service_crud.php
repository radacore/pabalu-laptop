<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('services', 'start_date') && ! Schema::hasColumn('services', 'pickup_date')) {
            DB::statement('ALTER TABLE services CHANGE start_date pickup_date DATE NULL');
        }

        if (Schema::hasColumn('services', 'status')) {
            DB::table('services')->where('status', 'pending')->update(['status' => 'received']);
            DB::table('services')->where('status', 'diagnosing')->update(['status' => 'diagnosed']);
            DB::table('services')->where('status', 'in_repair')->update(['status' => 'in_progress']);
            DB::table('services')->where('status', 'ready_pickup')->update(['status' => 'pickup_ready']);

            DB::statement("ALTER TABLE services MODIFY status ENUM('received', 'diagnosed', 'in_progress', 'waiting_parts', 'waiting_approval', 'repaired', 'pickup_ready', 'completed', 'cancelled') NOT NULL DEFAULT 'received'");
        }

        if (Schema::hasColumn('services', 'estimated_completion')) {
            DB::statement('ALTER TABLE services DROP COLUMN estimated_completion');
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('services', 'pickup_date') && ! Schema::hasColumn('services', 'start_date')) {
            DB::statement('ALTER TABLE services CHANGE pickup_date start_date DATE NULL');
        }

        if (Schema::hasColumn('services', 'status')) {
            DB::table('services')->where('status', 'received')->update(['status' => 'pending']);
            DB::table('services')->where('status', 'diagnosed')->update(['status' => 'diagnosing']);
            DB::table('services')->where('status', 'in_progress')->update(['status' => 'in_repair']);
            DB::table('services')->where('status', 'pickup_ready')->update(['status' => 'ready_pickup']);

            DB::statement("ALTER TABLE services MODIFY status ENUM('pending', 'diagnosing', 'waiting_parts', 'in_repair', 'ready_pickup', 'completed', 'cancelled') NOT NULL DEFAULT 'pending'");
        }

        if (! Schema::hasColumn('services', 'estimated_completion')) {
            DB::statement('ALTER TABLE services ADD estimated_completion DATE NULL AFTER start_date');
        }
    }
};
