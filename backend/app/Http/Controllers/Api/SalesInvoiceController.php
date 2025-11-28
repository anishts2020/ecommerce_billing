<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SalesInvoice;
use App\Models\SalesInvoiceItem;

class SalesInvoiceController extends Controller
{
    public function index()
    {
        return SalesInvoice::with(['customer','items.product'])
            ->orderBy('sales_invoice_id', 'DESC')
            ->get();
    }

    /**
     * Store invoice + items
     */
    public function store(Request $request)
    {
        $request->validate([
            'invoice_no'   => 'required',
            'invoice_date' => 'required',
            'customer_id'  => 'required',
            'grand_total'  => 'required',
            'discount'     => 'required',
            'tax'          => 'required',
            'net_total'    => 'required',
            'payment_mode' => 'required',
            'items'        => 'required|array'
        ]);

        // CREATE invoice only ONCE
        $invoice = SalesInvoice::create([
            'invoice_no'   => $request->invoice_no,
            'invoice_date' => $request->invoice_date,
            'customer_id'  => $request->customer_id,
            'cashier_id'   => $request->cashier_id ?? null,
            'grand_total'  => $request->grand_total,
            'discount'     => $request->discount,
            'tax'          => $request->tax,
            'net_total'    => $request->net_total,
            'payment_mode' => $request->payment_mode,
            'status'       => 'Completed',
            'remarks'      => $request->remarks ?? '',
        ]);

        // TOTAL quantity for proportional distribution
        $totalQty = collect($request->items)->sum('quantity');
        if ($totalQty == 0) $totalQty = 1;

        // INSERT items only ONCE
        foreach ($request->items as $item) {

            $itemDiscount = ($request->discount / $totalQty) * $item['quantity'];
            $itemTax      = ($request->tax / $totalQty) * $item['quantity'];

            SalesInvoiceItem::create([
                'sales_invoice_id' => $invoice->sales_invoice_id,
                'product_id'       => $item['product_id'],
                'quantity'         => $item['quantity'],
                'unit_price'       => $item['unit_price'],
                'discount_amount'  => round($itemDiscount, 2),
                'tax_percent'      => round($itemTax, 2),
                'grand_total'      => $item['grand_total'],
            ]);
        }

        return response()->json([
            'message' => 'Invoice saved successfully',
            'invoice' => $invoice
        ], 201);
    }

    /**
     * Show Single Invoice
     */
    public function show($id)
    {
        $invoice = SalesInvoice::with(['customer','items.product'])->find($id);

        if (!$invoice) {
            return response()->json(['message' => 'Invoice not found'], 404);
        }

        return response()->json([
            'invoice_id'    => $invoice->sales_invoice_id,
            'invoice_no'    => $invoice->invoice_no,
            'invoice_date'  => $invoice->invoice_date,
            'customer_name' => $invoice->customer->customer_name ?? 'Unknown',
            'discount'      => $invoice->discount,
            'tax'           => $invoice->tax,
            'grand_total'   => $invoice->grand_total,
            'net_total'     => $invoice->net_total,

            'items' => $invoice->items->map(function ($i) {
                return [
                    'sales_invoice_item_id' => $i->sales_invoice_item_id,
                    'product_name'          => $i->product->product_name ?? 'N/A',
                    'quantity'              => $i->quantity,
                    'unit_price'            => $i->unit_price,
                    'discount_amount'       => $i->discount_amount ?? 0,
                    'tax_percent'           => $i->tax_percent ?? 0,
                    'grand_total'           => $i->grand_total,
                ];
            }),
        ]);
    }

    /**
     * Get only items for React table
     */
    public function getItems($id)
    {
        $items = SalesInvoiceItem::with('product')
            ->where('sales_invoice_id', $id)
            ->get()
            ->map(function ($i) {
                return [
                    'sales_invoice_item_id' => $i->sales_invoice_item_id,
                    'product'               => [
                        'product_name' => $i->product->product_name ?? 'N/A'
                    ],
                    'quantity'              => $i->quantity,
                    'unit_price'            => $i->unit_price,
                    'discount_amount'       => $i->discount_amount ?? 0,
                    'tax_percent'           => $i->tax_percent ?? 0,
                    'grand_total'           => $i->grand_total,
                ];
            });

        return response()->json($items);
    }

    public function destroy($id)
    {
        $invoice = SalesInvoice::find($id);

        if (!$invoice) {
            return response()->json(['message' => 'Invoice not found'], 404);
        }

        $invoice->delete();

        return response()->json(['message' => 'Invoice deleted successfully']);
    }
}
