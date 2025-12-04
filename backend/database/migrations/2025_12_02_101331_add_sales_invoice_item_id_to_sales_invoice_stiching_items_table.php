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
        Schema::table('sales_invoice_stiching_items', function (Blueprint $table) {
            $table->unsignedBigInteger('sales_invoice_item_id')->after('sales_invoice_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sales_invoice_stiching_items', function (Blueprint $table) {
           $table->dropColumn('sales_invoice_item_id');
        });
    }
};
