<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('carousels', function (Blueprint $table) {
            $table->id();

            // image | video
            $table->enum('carousel_type', ['image', 'video']);

            $table->string('carousel_url');

            // 1,2,3,4,5...
            $table->unsignedInteger('carousel_order');

            $table->timestamps();

            // optional but smart: avoid duplicate orders
            $table->unique('carousel_order');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('carousels');
    }
};

