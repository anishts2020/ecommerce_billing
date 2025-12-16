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
            'product_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

            // Handle image upload
        if ($request->hasFile('product_image')) {
            $file = $request->file('product_image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('product_images'), $filename);
            $validated['product_image'] = $filename;
        }

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

        // Handle image upload
        if ($request->hasFile('product_image')) {
            $file = $request->file('product_image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('product_images'), $filename);

        // OPTIONAL: delete old image
        if ($product->product_image && file_exists(public_path('product_images' . $product->product_image))) {
                unlink(public_path('product_images/' . $product->product_image));
            }

            $validated['product_image'] = $filename;
        }

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

// SET product as New Arrival
public function setNewArrival(Request $request)
{
    $request->validate([
        'product_id' => 'required|exists:products,product_id',
    ]);

    $product = Products::find($request->product_id);
    if (!$product) return response()->json(['message' => 'Product not found'], 404);

    $product->update(['new_arrivals' => 1]);

    return response()->json(['message' => 'Product marked as New Arrival successfully'], 200);
}

// RESET product from New Arrival
public function resetNewArrival(Request $request)
{
    $request->validate([
        'product_id' => 'required|exists:products,product_id',
    ]);

    $product = Products::find($request->product_id);
    if (!$product) return response()->json(['message' => 'Product not found'], 404);

    $product->update(['new_arrivals' => 0]);

    return response()->json(['message' => 'Product reset from New Arrival successfully'], 200);
}
 // set featured product
public function setFeatured(Request $request)
    {
        Products::where('product_id', $request->product_id)
            ->update(['featured_products' => 1]);

        return response()->json([
            'message' => 'Product set as featured successfully'
        ]);
    }
 // reset featured product
    public function resetFeatured(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,product_id'
        ]);

        Products::where('product_id', $request->product_id)
            ->update(['featured_products' => 0]);

        return response()->json([
            'message' => 'Featured product reset'
        ]);
    }

    /**
     * GET all Occational products
     */
    public function getOccationalProducts()
    {
        $products = Products::where('occational_products', 1)
            ->select('product_id','product_name','product_code')
            ->get();

        return response()->json(['data' => $products]);
    }

    /**
     * Mark product as Occational
     */
    public function storeOccationalProduct(Request $request)
    {
        $request->validate([
            'product_code' => 'required|exists:products,product_code',
        ]);

        $product = Products::where('product_code', $request->product_code)->first();

        if ($product->occational_products == 1) {
            return response()->json([
                'message' => 'Product already marked as occational',
                'data' => [
                    'product_id' => $product->product_id,
                    'product_name' => $product->product_name,
                    'product_code' => $product->product_code,
                ]
            ], 200);
        }

        $product->occational_products = 1;
        $product->save();

        return response()->json([
            'message' => 'Product marked as occational successfully',
            'data' => [
                'product_id' => $product->product_id,
                'product_name' => $product->product_name,
                'product_code' => $product->product_code,
            ]
        ], 200);
    }

    /**
     * Remove product from Occational
     */
    public function removeOccationalProduct(Request $request)
    {
        $request->validate([
            'product_code' => 'required|exists:products,product_code',
        ]);

        $product = Products::where('product_code', $request->product_code)->first();
        $product->occational_products = 0;
        $product->save();

        return response()->json([
            'message' => 'Product removed from occational successfully',
            'data' => [
                'product_id' => $product->product_id,
                'product_name' => $product->product_name,
                'product_code' => $product->product_code,
            ]
        ], 200);
    }


    /**
 * SET product as top seller
 */
public function setTopSeller(Request $request)
{
    $request->validate([
        'product_id' => 'required|exists:products,product_id',
    ]);

    $product = Products::find($request->product_id);

    if (!$product) {
        return response()->json([
            'message' => 'Product not found'
        ], 404);
    }

    $product->top_sellers = 1;
    $product->save();

    return response()->json([
        'message' => 'Product marked as top seller successfully'
    ], 200);
}
public function resetTopSeller(Request $request)
{
    $request->validate([
        'product_id' => 'required|exists:products,product_id',
    ]);

    $product = Products::find($request->product_id);

    if (!$product) {
        return response()->json(['message' => 'Product not found'], 404);
    }

    $product->top_sellers = 0;
    $product->save();

    return response()->json(['message' => 'Product reset from top seller successfully'], 200);
}




}
