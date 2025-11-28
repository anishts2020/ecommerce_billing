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
        Schema::create('inventory_transactions', function (Blueprint $table) {
            $table->id('inventory_id');

            // Foreign Key
            $table->foreignId('product_id')
                ->constrained('products', 'product_id')
                ->onDelete('cascade');

            // Columns
            $table->integer('transaction_type');
            $table->integer('reference_table');   // reference table name
            $table->unsignedBigInteger('reference_id'); // reference record id
            $table->decimal('quantity', 10, 2);
            $table->decimal('unit_cost', 10, 2);
            $table->date('transaction_date');
            $table->string('remarks')->nullable();
            $table->integer('created_by');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory_transactions');
    }
};
