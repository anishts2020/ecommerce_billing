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
    Schema::create('product_image_table', function (Blueprint $table) {
        $table->id('product_image_id');
        $table->unsignedBigInteger('product_id');
        $table->string('product_code');
        $table->string('image');
        $table->timestamps();

        $table->foreign('product_id')->references('product_id')->on('products')->onDelete('cascade');
    });
}

public function down()
{
    Schema::dropIfExists('product_image_table');
}

};
