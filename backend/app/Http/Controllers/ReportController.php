<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function monthlyCategorySales()
    {
        $data = DB::table('sales_invoice_items as sii')
            ->join('products as p', 'sii.product_id', '=', 'p.product_id')
            ->join('product_categories as pc', 'p.category_id', '=', 'pc.product_category_id')
            ->select(
                'pc.product_category_name as category',
                DB::raw('SUM(sii.quantity) as total_sold')
            )
            ->whereMonth('sii.created_at', now()->month)
            ->whereYear('sii.created_at', now()->year)
            ->groupBy('pc.product_category_name')
            ->get();

        return response()->json($data);
    }
   
    public function salesProfitLine()
{
    $data = DB::table('sales_invoice_items as sii')
        ->join('products as p', 'sii.product_id', '=', 'p.product_id')
        ->select(
            DB::raw('DAY(sii.created_at) as day'),
            DB::raw('SUM(sii.grand_total) as total_sales'),
            DB::raw('SUM((sii.unit_price - p.cost_price) * sii.quantity) as profit')
        )
        ->whereMonth('sii.created_at', now()->month)
        ->whereYear('sii.created_at', now()->year)
        ->groupBy('day')
        ->orderBy('day', 'ASC')
        ->get();

    return response()->json($data);
}









}
