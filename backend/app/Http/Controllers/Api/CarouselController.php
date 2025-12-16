<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Carousel;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class CarouselController extends Controller
{
    /**
     * Display all carousels
     */
    public function index()
    {
        return Carousel::orderBy('carousel_order')->get();
    }

    /**
     * Store a new carousel
     */
    public function store(Request $request)
    {
        $request->validate([
            'carousel_type' => 'required|in:image,video',
            'carousel_order' => 'required|integer|min:1|unique:carousels,carousel_order',
            'file' => [
                'required',
                'file',
                'max:20480', // 20MB
                $request->carousel_type === 'image'
                    ? 'mimetypes:image/jpeg,image/png,image/webp'
                    : 'mimetypes:video/mp4,video/webm,video/ogg',
            ],
        ]);

        // Store file safely
        $path = $request->file('file')->store('carousel_files', 'public');

        $carousel = Carousel::create([
            'carousel_type'  => $request->carousel_type,
            'carousel_order' => $request->carousel_order,
            'carousel_url'   => 'storage/' . $path,
        ]);

        return response()->json([
            'message' => 'Carousel created successfully',
            'data'    => $carousel,
        ], 201);
    }

    /**
     * Update an existing carousel
     */
    public function update(Request $request, $id)
    {
        $carousel = Carousel::findOrFail($id);

        $request->validate([
            'carousel_type' => 'required|in:image,video',
            'carousel_order' => [
                'required',
                'integer',
                'min:1',
                Rule::unique('carousels', 'carousel_order')->ignore($carousel->id),
            ],
            'file' => [
                'nullable',
                'file',
                'max:20480', // 20MB
                $request->carousel_type === 'image'
                    ? 'mimetypes:image/jpeg,image/png,image/webp'
                    : 'mimetypes:video/mp4,video/webm,video/ogg',
            ],
        ]);

        // Replace file only if uploaded
        if ($request->hasFile('file')) {

            // Delete old file safely
            if ($carousel->carousel_url) {
                $oldPath = str_replace('storage/', '', $carousel->carousel_url);
                Storage::disk('public')->delete($oldPath);
            }

            $newPath = $request->file('file')->store('carousel_files', 'public');
            $carousel->carousel_url = 'storage/' . $newPath;
        }

        $carousel->carousel_type  = $request->carousel_type;
        $carousel->carousel_order = $request->carousel_order;
        $carousel->save();

        return response()->json([
            'message' => 'Carousel updated successfully',
            'data'    => $carousel,
        ]);
    }

    /**
     * Delete a carousel
     */
 /**
 * Swap carousel order (up / down)
 */
public function swapOrder(Request $request, $id)
{
    $request->validate([
        'direction' => 'required|in:up,down',
    ]);

    $current = Carousel::findOrFail($id);

    $targetOrder = $request->direction === 'up'
        ? $current->carousel_order - 1
        : $current->carousel_order + 1;

    $swapWith = Carousel::where('carousel_order', $targetOrder)->first();

    if (!$swapWith) {
        return response()->json([
            'message' => 'No swap possible'
        ], 400);
    }

    DB::transaction(function () use ($current, $swapWith) {

        $currentOrder = $current->carousel_order;
        $swapOrder    = $swapWith->carousel_order;

        // SAFE temporary value (works with UNSIGNED column)
        $temp = Carousel::max('carousel_order') + 1;

        $current->update(['carousel_order' => $temp]);
        $swapWith->update(['carousel_order' => $currentOrder]);
        $current->update(['carousel_order' => $swapOrder]);
    });

    return response()->json([
        'message' => 'Order swapped successfully'
    ]);
}
public function destroy($id)
{
    DB::transaction(function () use ($id) {

        $carousel = Carousel::findOrFail($id);

        // delete file if exists
        if ($carousel->carousel_url) {
            $path = str_replace('storage/', '', $carousel->carousel_url);
            Storage::disk('public')->delete($path);
        }

        $deletedOrder = $carousel->carousel_order;

        $carousel->delete();

        // 🔥 re-sequence remaining orders
        Carousel::where('carousel_order', '>', $deletedOrder)
            ->decrement('carousel_order');
    });

    return response()->json([
        'message' => 'Carousel deleted successfully',
    ]);
}



}