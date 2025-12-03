<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class TotalSalesController extends Controller
{
    public function index()
    {
        $today = Carbon::today()->toDateString();

        // Join sales_invoice_items with products and sales_invoices
        $sales = DB::table('sales_invoice_items as sii')
            ->join('products as p', 'sii.product_id', '=', 'p.product_id')
            ->join('sales_invoices as si', 'sii.sales_invoice_id', '=', 'si.sales_invoice_id')
            ->select(
                'si.sales_invoice_id as si_no',
                'p.product_name',
                'sii.grand_total'
            )
            ->whereDate('si.invoice_date', $today)
            ->get();

        // Calculate total grand total
        $totalAmount = $sales->sum('grand_total');

        return response()->json([
            'sales'       => $sales,
            'totalAmount' => $totalAmount
        ]);
    }
}
