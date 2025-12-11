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
        Schema::create('order', function (Blueprint $table) {
            $table->id('order_id');
            $table->string('order_no')->unique();      // Example: ORD-0001
            $table->integer('user_id');
            $table->decimal('total_amount', 10, 2)->default(0);
            $table->decimal('gst_amount', 10, 2)->default(0);
            $table->decimal('grand_total', 10, 2)->default(0);

            $table->string('payment_status')->default('pending'); // pending, paid, failed
            $table->string('payment_mode')->nullable();           // cash, card, upi, online

            $table->string('order_status')->default('processing'); // processing, shipped, delivered, cancelled

            $table->text('billing_address')->nullable();
            $table->text('shipping_address')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order');
    }
};
