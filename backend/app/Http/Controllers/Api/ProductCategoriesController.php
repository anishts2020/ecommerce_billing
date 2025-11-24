<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductCategory;   // ✅ correct model
use Illuminate\Http\Request;

class ProductCategoriesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
    public function index()
    {
        return ProductCategory::all();   // ✅ now correct
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_category_name' => 'required|unique:product_categories,product_category_name|string|max:100',
            'description' => 'required|string|max:255',
        ]);

        ProductCategory::create([
            'product_category_name' => $request->product_category_name,
            'description' => $request->description,
        ]);

        return response()->json(['message' => 'Category saved successfully']);
    }

    public function update(Request $request, $id)
    {
        $category = ProductCategory::find($id);

        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }
        

        $category->update([
            'product_category_name' => $request->product_category_name,
            'description' => $request->description,
        ]);

        return response()->json(['message' => 'Category updated successfully']);
    }

    public function destroy($id)
    {
        $category = ProductCategory::find($id);

        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        $category->delete();

        return response()->json(['message' => 'Category deleted successfully']);
    }
}
