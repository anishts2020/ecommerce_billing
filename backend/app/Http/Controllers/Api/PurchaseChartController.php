<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class PurchaseChartController extends Controller
{
    /**
     * Return monthly purchase totals for chart.
     */
   public function monthlyPurchaseChart(Request $request)
{
    $year = $request->year ?? date('Y');

    $data = DB::table('purchase_invoices')
        ->selectRaw('MONTH(created_at) as month, SUM(total_amount) as total')
        ->whereYear('created_at', $year)
        ->groupBy('month')
        ->orderBy('month')
        ->get();

    return response()->json($data);
}

}
