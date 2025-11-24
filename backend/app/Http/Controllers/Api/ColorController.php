<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Color;
use Illuminate\Http\Request;

class ColorController extends Controller
{
    public function index() {
        return response()->json(["colors" => Color::all()]);
    }

    public function store(Request $request) {
        $request->validate([
            "color_name" => "required",
            "color_code" => "required"
        ]);

        Color::create([
            "color_name" => $request->color_name,
            "color_code" => $request->color_code,
            "is_active" => $request->is_active ?? 1
        ]);

        return response()->json(["message" => "Color added successfully"]);
    }
}
