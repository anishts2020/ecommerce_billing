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
        Schema::create('purchase_invoices', function (Blueprint $table) {
            $table->id('purchase_id');
            $table->string('purchase_no');
            $table->dateTime('purchase_date');
            $table->integer('vendor_id');
            $table->integer('created_by');
            $table->decimal('total_amount',10,2);
            $table->decimal('tax_amount',10,2);
            $table->decimal('net_amount',10,2);
            $table->integer('payment_status');
            $table->text('remark')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchase_invoices');
    }
};
