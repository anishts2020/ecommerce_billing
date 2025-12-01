<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ProductType;

class ProductTypeController extends Controller
{
    public function index()
    {
        return response()->json(ProductType::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_type_name' => 'required|string|max:100',
            'description' => 'nullable|string|max:255',
            'is_active' => 'required|boolean',
        ]);

        $productType = ProductType::create($validated);

        return response()->json($productType, 201);
    }

    public function show($id)
    {
        return ProductType::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $productType = ProductType::findOrFail($id);

        $validated = $request->validate([
            'product_type_name' => 'required|string|max:100',
            'description' => 'nullable|string|max:255',
            
        ]);

        $productType->update($validated);

        return response()->json($productType);
    }

    public function destroy($id)
    {
        ProductType::findOrFail($id)->delete();

        return response()->json(['message' => 'Deleted successfully']);
    }
}
