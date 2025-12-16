<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;

class ProductVariantController extends Controller
{
    public function index($product_id)
    {
        // Load product variants with color & size
        $product = Product::with(['variants.color', 'variants.size'])
            ->findOrFail($product_id);

        // Map only required fields: id, color name, size name
        $variantsData = $product->variants->map(function ($variant) {
            return [
                'id' => $variant->id,
                'color' => $variant->color ? $variant->color->name : null,
                'size'  => $variant->size ? $variant->size->name : null,
            ];
        });

        return response()->json($variantsData);
    }
}
