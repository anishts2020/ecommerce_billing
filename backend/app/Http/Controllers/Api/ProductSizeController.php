<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Product_size;


class ProductSizeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Product_size::where('is_active', 1)->get();

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
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
        ], 204);
    }
}
