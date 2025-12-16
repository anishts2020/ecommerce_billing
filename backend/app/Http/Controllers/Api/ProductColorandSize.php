<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class ProductColorandSize extends Controller
{
    public function getProductDetails($productCode)
    {
        /* ---------- FETCH VALID VARIANTS ---------- */
        $variants = DB::table('products')
            ->leftJoin('materials', 'products.material_id', '=', 'materials.material_id')
            ->leftJoin('product_sizes', 'products.size_id', '=', 'product_sizes.size_id')
            ->leftJoin('colors', 'products.color_id', '=', 'colors.color_id')
            ->where('products.product_code', $productCode)
            ->select(
                'products.product_code',
                'products.product_name',
                'products.product_description',
                'products.size_id',
                'product_sizes.size_name',
                'products.color_id',
                'colors.color_name',
                'products.selling_price',
                'products.product_image',
                'materials.material_name'
            )
            ->get();

        if ($variants->isEmpty()) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $base = $variants->first();

        /* ---------- SEND VARIANTS AS-IS ---------- */
        $variantList = $variants->map(function ($v) {
            return [
                'size_id'   => $v->size_id,
                'size_name' => $v->size_name,
                'color_id'  => $v->color_id,
                'color_name'=> $v->color_name,
                'price'     => (float) $v->selling_price,
                'image'     => $v->product_image,
            ];
        });

        return response()->json([
            'product_code' => $base->product_code,
            'product_name' => $base->product_name,
            'description'  => $base->product_description ?? '',
            'material'     => $base->material_name ?? 'N/A',
            'variants'     => $variantList
        ]);
    }
}
