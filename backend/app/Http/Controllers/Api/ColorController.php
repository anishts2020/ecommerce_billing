<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Color;

class ColorController extends Controller
{
    public function index(Request $request)
{
    $query = \App\Models\Color::query();

    // SEARCH
    if ($request->has('search') && $request->search != '') {
        $search = $request->search;
        $query->where('color_name', 'like', "%$search%");
    }

    // PAGINATION
    $colors = $query->orderBy('color_name', 'asc')->paginate(10); // 10 per page

    return response()->json($colors);
}

    public function store(Request $request)
    {
        $request->validate([
            'color_name' => 'required|string',
            'color_code' => 'required|string',
        ]);

        $color = Color::create([
            'color_name' => $request->color_name,
            'color_code' => $request->color_code,
            'is_active' => $request->is_active ?? 1,
        ]);

        return response()->json(['message' => 'Color created successfully', 'data' => $color], 201);
    }

    public function update(Request $request, $id)
    {
        $color = Color::findOrFail($id);

        $request->validate([
            'color_name' => 'required|string',
            'color_code' => 'required|string',
        ]);

        $color->update([
            'color_name' => $request->color_name,
            'color_code' => $request->color_code,
        ]);

        return response()->json(['message' => 'Color updated successfully', 'data' => $color]);
    }

    public function destroy($id)
    {
        $color = Color::findOrFail($id);
        $color->delete();

        return response()->json(['message' => 'Color deleted successfully']);
    }
}
