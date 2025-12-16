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
        Schema::create('orders', function (Blueprint $table) {
            $table->id('order_id');
            $table->string('order_no')->unique();
            $table->unsignedBigInteger('user_id');

            $table->decimal('total_amount', 10, 2);
            $table->decimal('gst_amount', 10, 2);
            $table->decimal('grand_total', 10, 2);

            $table->string('payment_status')->default('pending'); // pending, paid, failed
            $table->string('payment_mode')->nullable(); // COD, UPI, card

            $table->string('order_status')->default('processing');  
            // processing, packed, shipped, delivered, cancelled

            $table->text('billing_address');
            $table->text('shipping_address');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
