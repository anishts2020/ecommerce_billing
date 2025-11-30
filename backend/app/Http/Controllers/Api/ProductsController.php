<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Products;
use Illuminate\Http\Request;

class ProductsController extends Controller
{
    /**
     * GET all products
     */
    public function index()
    {
        return Products::with(['category','type','color','size','vendor'])->get();

    }

    /**
     * CREATE new product
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_code' => 'required|string',
            'sku' => 'required|string',
            'product_name' => 'required|string',
            'product_description' => 'nullable|string',
            'category_id' => 'required|integer',
            'type_id' => 'required|integer',
            'material_id' => 'nullable|exists:materials,material_id',
            'color_id' => 'required|integer',
            'size_id' => 'required|integer',
            'vendor_id' => 'required|integer',
            'unit_of_measure' => 'required|string',
            'quantity_on_hand' => 'required|numeric',
            'min_stock_level' => 'required|numeric',
            'cost_price' => 'required|numeric',
            'selling_price' => 'required|numeric',
            'tax_percent' => 'required|numeric',
            'is_published' => 'nullable|integer',
            'is_active' => 'nullable|integer',
        ]);

        $product = Products::create($validated);

        return response([
            "message" => "Product created successfully",
            "data" => $product
        ], 201);
    }

    /**
     * GET single product
     */
    public function show($id)
    {
        $product = Products::with(['category', 'type', 'color', 'size', 'vendor'])
                           ->find($id);

        if (!$product) {
            return response(["message" => "Product not found"], 404);
        }

        return $product;
    }

    /**
     * UPDATE product
     */
    public function update(Request $request, $id)
{
    $product = Products::find($id);

    if (!$product) {
        return response(["message" => "Product not found"], 404);
    }

    // Allow only fields that exist in the table
    $validated = $request->only([
        'product_code',
        'sku',
        'product_name',
        'product_description',
        'category_id',
        'type_id',
        'color_id',
        'size_id',
        'vendor_id',
        'unit_of_measure',
        'quantity_on_hand',
        'min_stock_level',
        'cost_price',
        'selling_price',
        'tax_percent',
        'is_published',
        'is_active'
    ]);

    $product->update($validated);

    return response([
        "message" => "Product updated successfully",
        "data" => $product
    ], 200);
}


    /**
     * DELETE product
     */
    public function destroy($id)
    {
        $product = Products::find($id);

        if (!$product) {
            return response(["message" => "Product not found"], 404);
        }

        $product->delete();

        return response(["message" => "Product deleted successfully"], 200);
    }
}
