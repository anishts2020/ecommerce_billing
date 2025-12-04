<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sales_invoice_stiching_items', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('sales_invoice_id');
            $table->unsignedBigInteger('sales_invoice_item_id'); // MANDATORY LINK
            $table->unsignedBigInteger('customer_id')->nullable();
            $table->unsignedBigInteger('product_id')->nullable();
            $table->unsignedBigInteger('stiching_type_id')->nullable();

            // Names stored for easy display
            $table->string('customer_name')->nullable();
            $table->string('product_name')->nullable();
            $table->string('stiching_type_name');
            $table->decimal('rate', 10, 2)->default(0);

            $table->timestamps();

            // FOREIGN KEYS (Optional but good practice)
            $table->foreign('sales_invoice_id')->references('sales_invoice_id')->on('sales_invoices')->onDelete('cascade');
            $table->foreign('sales_invoice_item_id')->references('sales_invoice_item_id')->on('sales_invoice_items')->onDelete('cascade');
            $table->foreign('customer_id')->references('id')->on('customers')->onDelete('set null');
            $table->foreign('product_id')->references('product_id')->on('products')->onDelete('set null');
            $table->foreign('stiching_type_id')->references('stiching_type_id')->on('stiching_types')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sales_invoice_stiching_items');
    }
};
