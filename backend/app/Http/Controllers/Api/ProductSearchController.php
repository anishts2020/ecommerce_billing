<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Products; // your model name

class ProductSearchController extends Controller
{
    public function search(Request $request)
    {
        $query = $request->input('q');

        if (!$query) {
            return response()->json([]);
        }

        return Products::where('product_name', 'LIKE', '%' . $query . '%')
            ->limit(20)
            ->get();
    }
}
