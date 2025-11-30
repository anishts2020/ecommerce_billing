<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ProductSize;

class ProductSizeController extends Controller
{
    public function index()
    {
        return response()->json(ProductSize::all(), 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'size_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'required|boolean',
        ]);

        $size = ProductSize::create($validated);

        return response()->json([
            'message' => 'Product size added successfully',
            'data' => $size
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $size = ProductSize::findOrFail($id);

        $validated = $request->validate([
            'size_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'required|boolean',
        ]);

        $size->update($validated);

        return response()->json([
            'message' => 'Product size updated successfully',
            'data' => $size
        ], 200);
    }

    public function destroy($id)
    {
        $size = ProductSize::findOrFail($id);
        $size->delete();

        return response()->json([
            'message' => 'Product size deleted successfully'
        ], 200);
    }
}
