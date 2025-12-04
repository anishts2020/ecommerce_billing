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
      Schema::create('coupons_master', function (Blueprint $table) {
    $table->id('coupon_master_id');
    
    $table->string('coupon_code', 100)->unique(); // VARCHAR(100)
    $table->string('description', 255)->nullable();

    $table->unsignedTinyInteger('discount_type')->nullable(); // tinyint
    $table->decimal('discount_value', 10, 2)->nullable();     // decimal

    $table->decimal('minimum_order_amount', 12, 2)->nullable();
    $table->decimal('maximum_discount_amount', 12, 2)->nullable();

    $table->unsignedInteger('usage_limit')->nullable();
    $table->unsignedInteger('usage_limit_per_user')->nullable();

    $table->date('valid_from')->nullable();
    $table->date('valid_to')->nullable();

    $table->tinyInteger('is_active')->default(1);

    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('coupon_masters');
    }
};
