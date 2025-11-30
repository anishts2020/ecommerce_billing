<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reference;
use Illuminate\Http\Request;

class ReferenceController extends Controller
{
    // LIST ALL REFERENCES
    public function index()
    {
        return response()->json(Reference::all(), 200);
    }
}
