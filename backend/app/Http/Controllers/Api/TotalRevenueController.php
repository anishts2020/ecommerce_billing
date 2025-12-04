<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class TotalRevenueController extends Controller
{
    public function revenueToday()
    {
        $today = now()->toDateString();

        // Fetch all product sales for today
        $items = DB::table('sales_invoice_items')
            ->join('sales_invoices', 'sales_invoice_items.sales_invoice_id', '=', 'sales_invoices.sales_invoice_id')
            ->join('products', 'sales_invoice_items.product_id', '=', 'products.product_id')
            ->whereDate('sales_invoices.invoice_date', $today)
            ->select(
                'products.product_id',
                'products.product_name',
                'products.cost_price',
                DB::raw('SUM(sales_invoice_items.quantity) AS total_qty'),
                DB::raw('SUM(sales_invoice_items.grand_total) AS total_sales')
            )
            ->groupBy(
                'products.product_id',
                'products.product_name',
                'products.cost_price'
            )
            ->get();

        $totalRevenue = 0;
        $productWiseRevenue = [];

        foreach ($items as $item) {
            // Revenue formula
            $revenue = $item->total_sales - ($item->cost_price * $item->total_qty);
            $totalRevenue += $revenue;

            $productWiseRevenue[] = [
                'product_name' => $item->product_name,
                'quantity_sold' => $item->total_qty,
                'sales_total' => $item->total_sales,
                'cost_price' => $item->cost_price,
                'revenue' => $revenue
            ];
        }

        return response()->json([
            'totalRevenueToday' => $totalRevenue,
            'productWiseRevenue' => $productWiseRevenue
        ]);
    }
}
