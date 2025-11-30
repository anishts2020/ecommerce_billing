<?php
// database/migrations/xxxx_add_material_id_to_products_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('products', function (Blueprint $table) {
            $table->unsignedBigInteger('material_id')->nullable()->after('type_id');

            // If you want a foreign key constraint:
            $table->foreign('material_id')->references('material_id')->on('materials')->onDelete('set null');
        });
    }

    public function down(): void {
        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign(['material_id']);
            $table->dropColumn('material_id');
        });
    }
};
