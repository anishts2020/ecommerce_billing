<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;


use App\Models\Materials; 

class MaterialsController extends Controller
{
    public function index()
    {
        return Materials::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'material_name' => 'required|string|max:100',
            'description'   => 'required|string|max:255',
            
        ]);

        $material = Materials::create($request->only(['material_name', 'description','is_active']));

        return response()->json($material, 201);
    }

    public function show($id)
    {
        $material = Materials::findOrFail($id);
        return response()->json($material);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'material_name' => 'required|string|max:100',
            'description'   => 'required|string|max:255',
            
        ]);

        $material = Materials::findOrFail($id);
        $material->update($request->only(['material_name', 'description',]));

        return response()->json(['message' => 'Material updated successfully', 'material' => $material]);
    }

    public function destroy($id)
    {
        $material = Materials::findOrFail($id);
        $material->delete();

        return response()->json(['message' => 'Material deleted successfully']);
    }
}
