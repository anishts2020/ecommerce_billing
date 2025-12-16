<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class ProductOptionRateController extends Controller
{
    public function show($productId)
    {
        // Fetch sizes
        $sizes = DB::table('product_size_rate as psr')
            ->join('product_sizes as ps', 'psr.size_id', '=', 'ps.size_id')
            ->where('psr.product_id', $productId)
            ->where('ps.is_active', 1)
            ->select('ps.size_id as id', 'ps.size_name as name')
            ->get();

        // Fetch colors
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
