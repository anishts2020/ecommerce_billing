<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('coupon_products', function (Blueprint $table) {
            $table->id();

            // Foreign Keys
            $table->unsignedBigInteger('coupon_id');
            $table->unsignedBigInteger('product_id');

            $table->timestamps();

            // Relationships
            $table->foreign('coupon_id')->references('id')->on('coupons_master')->onDelete('cascade');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('coupon_products');
    }
};
