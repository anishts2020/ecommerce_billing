<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\StichingType;

class StichingTypeController extends Controller
{
    public function index()
    {
        return StichingType::orderBy('stiching_type_id', 'ASC')->get();
    }
     public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'rate' => 'required|numeric'
        ]);

        return StichingType::create([
            'name' => $request->name,
            'rate' => $request->rate
        ]);
    }

    public function update(Request $request, $id)
    {
        $stichingType = StichingType::findOrFail($id);

        $stichingType->update([
            'name' => $request->name,
            'rate' => $request->rate
        ]);

        return $stichingType;
    }
    public function destroy($id)
    {
        $stichingType = StichingType::findOrFail($id);
        $stichingType->delete();

        return response()->json(['message' => 'Deleted successfully']);
    }

}
