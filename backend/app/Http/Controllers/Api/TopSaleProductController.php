<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class TopSaleProductController extends Controller
{
    /**
     * Return top-selling products for the current month
     */
    public function index()
    {
        try {
            $startOfMonth = Carbon::now()->startOfMonth()->toDateString();
            $endOfMonth = Carbon::now()->endOfMonth()->toDateString();

            $top = DB::table('sales_invoice_items as sii')
                ->join('products as p', 'sii.product_id', '=', 'p.product_id')
                ->join('sales_invoices as si', 'sii.sales_invoice_id', '=', 'si.sales_invoice_id')
                ->whereBetween('si.invoice_date', [$startOfMonth, $endOfMonth])
                ->select(
                    'p.product_id as product_id',
                    'p.product_name',
                    DB::raw('ROUND(SUM(sii.quantity), 0) as total_sold')
                )
                ->groupBy('p.product_id', 'p.product_name')
                ->orderByDesc('total_sold')
                ->limit(10)
                ->get()
                ->map(fn($i) => (array) $i)
                ->values()
                ->all();

            return response()->json($top);
        } catch (\Exception $e) {
            return response()->json([
                'error' => true,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
