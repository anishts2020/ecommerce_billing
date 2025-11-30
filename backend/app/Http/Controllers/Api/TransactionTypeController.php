<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TransactionType;

class TransactionTypeController extends Controller
{
    /**
     * Display all transaction types.
     */
    public function index()
    {
        $types = TransactionType::orderBy('id', 'asc')->get();
        return response()->json($types);
    }
}
