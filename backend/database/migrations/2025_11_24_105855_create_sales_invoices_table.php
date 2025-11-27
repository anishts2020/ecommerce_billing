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
        Schema::create('sales_invoices', function (Blueprint $table) {
            $table->id('sales_invoice_id');
            $table->string('invoice_no');
            $table->date('invoice_date');
            
             $table->integer('customer_id')->nullable();
             $table->integer('cashier_id')->nullable();

       
       
        // Amounts
        $table->decimal('grand_total', 10, 2)->default(0);
        $table->decimal('discount', 10, 2)->default(0);
        $table->decimal('tax', 10, 2)->default(0);
        $table->decimal('net_total', 10, 2)->default(0);

        // Payment
        $table->integer('payment_mode')->nullable(); // Cash, UPI, Card
        $table->string('status')->default('PAID'); // PAID / PENDING
        $table->string('remarks');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sales_invoices');
    }
};
