<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Products;
use App\Models\ProductImage;
use Illuminate\Http\Request;

class ProductImageController extends Controller
{
    // GET ALL IMAGES FOR PRODUCT
    public function index($productId)
    {
        $images = ProductImage::where('product_id', $productId)->get();
        return response()->json($images);
    }

    // UPLOAD MULTIPLE EXTRA IMAGES
    public function upload(Request $request)
    {
        $request->validate([
            'product_id' => 'required|integer',
            'images.*'   => 'required|image|mimes:jpg,jpeg,png,webp|max:4096'
        ]);

        $product = Products::findOrFail($request->product_id);

        foreach ($request->file('images') as $file) {
            $filename = time() . "_" . uniqid() . "." . $file->getClientOriginalExtension();
            $file->move(public_path("product_images"), $filename);

            ProductImage::create([
                'product_id' => $product->product_id,
                'product_code' => $product->product_code,
                'image' => $filename
            ]);
        }

        return response()->json(['message' => 'Images uploaded successfully']);
    }

    // EDIT IMAGE (REPLACE FILE)
    public function update(Request $request, $imageId)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpg,jpeg,png,webp|max:4096'
        ]);

        $image = ProductImage::findOrFail($imageId);

        // Delete old file
        $oldPath = public_path("product_images/" . $image->image);
        if (file_exists($oldPath)) unlink($oldPath);

        // Upload new file
        $file = $request->file('image');
        $filename = time() . "_" . uniqid() . "." . $file->getClientOriginalExtension();
        $file->move(public_path("product_images"), $filename);

        $image->update(['image' => $filename]);

        return response()->json(['message' => 'Image updated successfully']);
    }

    // DELETE EXTRA IMAGE
    public function destroy($id)
    {
        $image = ProductImage::findOrFail($id);

        $path = public_path("product_images/" . $image->image);
        if (file_exists($path)) unlink($path);

        $image->delete();

        return response()->json(['message' => 'Image deleted']);
    }

    // DELETE MAIN PRODUCT IMAGE
    public function deleteMain($productId)
    {
        $product = Products::findOrFail($productId);

        $path = public_path("product_images/" . $product->product_image);
        if (file_exists($path)) unlink($path);

        $product->update(['product_image' => null]);

        return response()->json(['message' => 'Main image deleted']);
    }

    // UPDATE MAIN IMAGE
    public function updateMain(Request $request, $productId)
    {
        $request->validate([
            'image' => 'required|image|max:4096'
        ]);

        $product = Products::findOrFail($productId);

        // Delete old
        if ($product->product_image) {
            $old = public_path("product_images/" . $product->product_image);
            if (file_exists($old)) unlink($old);
        }

        $file = $request->file('image');
        $filename = time() . "_" . uniqid() . "." . $file->getClientOriginalExtension();
        $file->move(public_path("product_images"), $filename);

        $product->update(['product_image' => $filename]);

        return response()->json(['message' => 'Main image updated']);
    }
}
