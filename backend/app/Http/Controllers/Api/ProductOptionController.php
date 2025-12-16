<?php
// src/Http/Controllers/Api/ProductOptionsController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductOptionsController extends Controller
{
    public function getOptions($productId)
    {
        // Fetch available sizes for this product
        $sizes = DB::table('product_size_rate as psr')
            ->join('product_sizes as ps', 'psr.size_id', '=', 'ps.size_id')
            ->where('psr.product_id', $productId)
            ->where('ps.is_active', 1)
            ->select('ps.size_id as id', 'ps.size_name as name')
            ->get();

        // Fetch available colors for this product
        $colors = DB::table('product_color_rate as pcr')
            ->join('colors as c', 'pcr.color_id', '=', 'c.color_id')
            ->where('pcr.product_id', $productId)
            ->where('c.is_active', 1)
            ->select('c.color_id as id', 'c.color_name as name')
            ->get();

        return response()->json([
            'sizes' => $sizes,
            'colors' => $colors
        ]);
    }
}
