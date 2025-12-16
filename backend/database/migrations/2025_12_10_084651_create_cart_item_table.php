<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */ 
    public function up()
{
    Schema::create('cart_item', function (Blueprint $table) {
        $table->id('cart_item_id');  // SERIAL PK
        $table->unsignedBigInteger('cart_id');
        $table->unsignedBigInteger('product_id');

        $table->integer('quantity');
        $table->decimal('price', 10, 2);
        $table->decimal('subtotal', 10, 2);

        $table->timestamps();

        // Foreign Keys
        $table->foreign('cart_id')->references('cart_id')->on('cart')->onDelete('cascade');
        $table->foreign('product_id')->references('product_id')->on('products')->onDelete('cascade');
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cart_item');
    }
};
