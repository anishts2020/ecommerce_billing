<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SalesInvoice;
use App\Models\SalesInvoiceItem;
use App\Models\SalesInvoiceStichingItem;
use App\Models\StichingType;

class SalesInvoiceController extends Controller
{

    public function stitchingItems()
{
    return SalesInvoiceStichingItem::orderBy('id', 'DESC')->get();
}

public function index()
{
    return SalesInvoice::with('customer')
        ->orderBy('sales_invoice_id', 'DESC')
        ->get();
}
public function show($id)
{
    return SalesInvoice::with([
        'customer',
        'items.product',
        'stitching.product',
        'stitching.customer'
    ])
    ->where('sales_invoice_id', $id)
    ->first();
}


public function getStitchingForInvoice($invoice_id)
{
    return SalesInvoiceStichingItem::with(['product', 'customer'])
    ->where('sales_invoice_id', $invoice_id)
        ->orderBy('id', 'DESC')
        ->get();
}



    public function store(Request $request)
    {
        $request->validate([
            'invoice_no'      => 'required',
            'invoice_date'    => 'required|date',
            'customer_id'     => 'nullable|integer',
            'grand_total'     => 'required|numeric',
            'discount'        => 'nullable|numeric',
            'tax'             => 'nullable|numeric',
            'net_total'       => 'required|numeric',
            'payment_mode'    => 'required',
            'items'           => 'required|array|min:1',
            'stiching_items'  => 'nullable|array'
        ]);

        // CREATE invoice
        $invoice = SalesInvoice::create([
            'invoice_no'   => $request->invoice_no,
            'invoice_date' => $request->invoice_date,
            'customer_id'  => $request->customer_id,
            
            'cashier_id'   => $request->cashier_id ?? null,
            'grand_total'  => $request->grand_total,
            'discount'     => $request->discount ?? 0,
            'tax'          => $request->tax ?? 0,
            'net_total'    => $request->net_total,
            'payment_mode' => $request->payment_mode,
            'status'       => $request->status ?? 'Completed',
            'remarks'      => $request->remarks ?? '',
        ]);

        // Map: temp_id => sales_invoice_item_id (temp_id provided by client)
        $createdItems = [];
        // Also map by product_id as fallback (may be ambiguous if duplicates)
        $createdByProduct = [];

        foreach ($request->items as $item) {
            $savedItem = SalesInvoiceItem::create([
                'sales_invoice_id' => $invoice->sales_invoice_id,
                'product_id'       => $item['product_id'] ?? null,
                

                'quantity'         => $item['quantity'] ?? 0,
                'unit_price'       => $item['unit_price'] ?? 0,
                'discount_amount'  => $item['discount_amount'] ?? 0,
                'tax_percent'      => $item['tax_percent'] ?? 0,
                'grand_total'      => $item['grand_total'] ?? 0,
            ]);

            if (!empty($item['temp_id'])) {
                $createdItems[$item['temp_id']] = $savedItem->sales_invoice_item_id;
            }

            if (!empty($item['product_id'])) {
                // store array of ids in case multiple same product
                $createdByProduct[$item['product_id']][] = $savedItem->sales_invoice_item_id;
            }
        }

        // Save stitching items
        if ($request->has('stiching_items') && is_array($request->stiching_items)) {
            foreach ($request->stiching_items as $s) {
                // Prefer mapping by item_temp_id
                $invoiceItemId = null;
                if (!empty($s['item_temp_id']) && isset($createdItems[$s['item_temp_id']])) {
                    $invoiceItemId = $createdItems[$s['item_temp_id']];
                } elseif (!empty($s['product_id']) && !empty($createdByProduct[$s['product_id']])) {
                    // if multiple mapped, take last created for that product
                    $arr = $createdByProduct[$s['product_id']];
                    $invoiceItemId = end($arr);
                }

                // if we still don't have invoiceItemId, skip this stitching row
                if (!$invoiceItemId) {
                    continue;
                }

                $stitchName = $s['stiching_type_name'] ?? null;
                if (!$stitchName && !empty($s['stiching_type_id'])) {
                    $type = StichingType::find($s['stiching_type_id']);
                    if ($type) $stitchName = $type->name;
                }
            
                SalesInvoiceStichingItem::create([
    'sales_invoice_id'      => $invoice->sales_invoice_id,
    'sales_invoice_item_id' => $invoiceItemId,
    'customer_id'           => $invoice->customer_id,
    'customer_name'         => $request->customer_name ?? null,   // MUST ADD
    'product_id'            => $s['product_id'] ?? null,
    'product_name'          => $s['product_name'] ?? null,        // MUST ADD
    'stiching_type_id'      => $s['stiching_type_id'] ?? null,
    'stiching_type_name'    => $stitchName,
    'rate'                  => $s['rate'] ?? 0,
]);

}
        }

        return response()->json([
            'message' => 'Invoice saved successfully',
            'invoice' => $invoice
        ], 201);
    }
    

    public function monthlySummary()
{
    $data = \DB::table('sales_invoices')
        ->selectRaw("DATE_FORMAT(invoice_date, '%Y-%m') as month, SUM(net_total) as total")
        ->groupBy('month')
        ->orderBy('month', 'ASC')
        ->get();

    return response()->json($data);
}

public function monthlySummaryByYear($year)
{
    $data = \DB::table('sales_invoices')
        ->selectRaw("DATE_FORMAT(invoice_date, '%Y-%m') as month, SUM(net_total) as total")
        ->whereYear('invoice_date', $year)
        ->groupBy('month')
        ->orderBy('month', 'ASC')
        ->get();

    return response()->json($data);
}



}
