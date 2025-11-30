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
        Schema::create('sales_invoice_items', function (Blueprint $table) {
            $table->id('sales_invoice_item_id'); // Primary key

        $table->integer('sales_invoice_id');
        $table->integer('product_id');

        $table->decimal('quantity', 10, 2);
        $table->decimal('unit_price', 10, 2);
        $table->decimal('discount_amount', 10, 2)->default(0);
        $table->decimal('tax_percent', 10, 2)->default(0);
        $table->decimal('grand_total', 10, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sales_invoice_items');
    }
};
