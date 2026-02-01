<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('previsions', function (Blueprint $table) {
            $table->id();
            $table->date('date_prevision');
            $table->decimal('total_income', 14, 2)->default(0.00);
            $table->decimal('total_expense', 14, 2)->default(0.00);
            $table->decimal('total_interest', 14, 2)->default(0.00);
            $table->decimal('total_final', 14, 2)->default(0.00);
            $table->dateTime('created_at')->useCurrent();
            $table->dateTime('updated_at')->nullable()->default(null);
            $table->unsignedBigInteger('account_id');
            $table->foreign('account_id')->references('id')->on('accounts')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('previsions');
    }
};
