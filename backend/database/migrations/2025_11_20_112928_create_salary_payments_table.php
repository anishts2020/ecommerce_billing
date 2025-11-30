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
        Schema::create('salary_payments', function (Blueprint $table) {
            $table->id('salary_payment_id');

            $table->unsignedBigInteger('employee_id');

            $table->tinyInteger('salary_month');   // 1-12
            $table->integer('salary_year');       // YYYY format

            $table->decimal('gross_salary', 10, 2);
            $table->decimal('deductions', 10, 2)->nullable();
            $table->decimal('net_salary', 10, 2);

            $table->date('payment_date')->nullable();
            $table->tinyInteger('payment_mode')->comment('1 = Cash, 2 = Bank Transfer, 3 = UPI');


            $table->integer('created_by')->nullable();
            $table->text('remarks')->nullable();

            $table->timestamps();

            // Foreign key connection to employees table
            $table->foreign('employee_id')
                  ->references('id')
                  ->on('employee')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('salary_payments');
    }
};
