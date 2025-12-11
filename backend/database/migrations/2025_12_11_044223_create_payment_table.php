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
        Schema::create('payment', function (Blueprint $table) {
           $table->id('payment_id');

            $table->unsignedBigInteger('order_id');
            $table->string('transaction_id')->nullable();
            $table->decimal('amount', 10, 2);

            $table->dateTime('payment_date')->nullable();

            $table->string('payment_mode'); // cash, upi, card
            $table->string('payment_status'); // success, failed, refunded

            $table->timestamps();

            // Foreign Key
            $table->foreign('order_id')->references('order_id')->on('orders')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment');
    }
};
