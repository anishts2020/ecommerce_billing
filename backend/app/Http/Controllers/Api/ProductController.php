<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Products;

class ProductController extends Controller
{
   public function getByBarcode($barcode)
{
    // Since barcode = product_id
    $product = Products::find($barcode);

    if (!$product) {
        return response()->json(['message' => 'Product not found'], 404);
    }

    return response()->json([
        'product_id'        => $product->product_id,
        'product_name'      => $product->product_name,
        'selling_price'     => $product->selling_price,
        'product_code'      => $product->product_code,
        'quantity_on_hand'  => $product->quantity_on_hand,
    ]);
}

}

