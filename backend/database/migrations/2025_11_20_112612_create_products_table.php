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
        Schema::create('products', function (Blueprint $table) {
            $table->id('product_id');
            $table->String('product_code');
            $table->string('sku');
            $table->string('product_name');
            $table->text('product_description');
            $table->integer('category_id');
            $table->integer('type_id');
            $table->integer('color_id');
            $table->integer('size_id');
            $table->integer('vendor_id');
            $table->string('unit_of_measure');
            $table->decimal('quantity_on_hand',10,2);
            $table->decimal('min_stock_level',10,2);
            $table->decimal('cost_price',10,2);
            $table->decimal('selling_price',10,2);
            $table->decimal('tax_percent',10,2);
            $table->tinyInteger('is_published');
            $table->tinyInteger('is_active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
