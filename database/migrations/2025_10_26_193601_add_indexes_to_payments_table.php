<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->index('transaction_id');
            $table->index('bank_id');
            $table->index('paid_amount');
            $table->index('paid_on');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropIndex(['transaction_id']);
            $table->dropIndex(['bank_id']);
            $table->dropIndex(['paid_amount']);
            $table->dropIndex(['paid_on']);
            $table->dropIndex(['created_at']);
        });
    }
};
