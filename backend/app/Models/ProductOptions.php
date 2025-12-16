<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductSizeRate;
use App\Models\ProductColorRate;

class ProductOptionsController extends Controller
{
    public function getOptions($productId)
    {
        $sizes = ProductSizeRate::where('product_id', $productId)
            ->with('size')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->size->id,
                    'name' => $item->size->size_name
                ];
            });

        $colors = ProductColorRate::where('product_id', $productId)
            ->with('color')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->color->id,
                    'name' => $item->color->color_name,
                    'code' => $item->color->color_code
                ];
            });

        return response()->json([
            'sizes' => $sizes,
            'colors' => $colors
        ]);
    }
}
