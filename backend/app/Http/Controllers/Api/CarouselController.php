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

            // 🔥 Store directly in public/carousel_files
    $file = $request->file('file');
    $filename = time() . '_' . $file->getClientOriginalName();
    $file->move(public_path('carousel_files'), $filename);

        $carousel = Carousel::create([
            'carousel_type'  => $request->carousel_type,
            'carousel_order' => $request->carousel_order,
            'carousel_url'   => 'carousel_files/' . $filename, // ✅ clean path
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

    // 🔁 Replace file only if new file uploaded
    if ($request->hasFile('file')) {

        // 🗑 Delete old file from public folder
        if ($carousel->carousel_url && file_exists(public_path($carousel->carousel_url))) {
            unlink(public_path($carousel->carousel_url));
        }

        // 📁 Ensure directory exists
        $destination = public_path('carousel_files');
        if (!file_exists($destination)) {
            mkdir($destination, 0755, true);
        }

        // 📦 Save new file
        $file = $request->file('file');
        $filename = uniqid() . '.' . $file->getClientOriginalExtension();
        $file->move($destination, $filename);

        // 💾 Update DB path
        $carousel->carousel_url = 'carousel_files/' . $filename;
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

        // 🗑 Delete file from public/carousel_files
        if ($carousel->carousel_url && file_exists(public_path($carousel->carousel_url))) {
            unlink(public_path($carousel->carousel_url));
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