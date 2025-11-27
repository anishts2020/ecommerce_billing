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
        return SalesInvoice::with([
            'customer',
            'items.product'
        ])->orderBy('sales_invoice_id', 'DESC')->get();
    }

    /**
     * Store a new invoice with items.
     */
    public function store(Request $request)
    {
        $request->validate([
            'invoice_no' => 'required',
            'invoice_date' => 'required',
            'customer_id' => 'required',
            'grand_total' => 'required',
            'discount' => 'required',
            'tax' => 'required',
            'net_total' => 'required',
            'payment_mode' => 'required',
            'items' => 'required|array',
        ]);

        // Create invoice
        $invoice = SalesInvoice::create([
            'invoice_no' => $request->invoice_no,
            'invoice_date' => $request->invoice_date,
            'customer_id' => $request->customer_id,
            'cashier_id' => $request->cashier_id ?? null,
            'grand_total' => $request->grand_total,
            'discount' => $request->discount,
            'tax' => $request->tax,
            'net_total' => $request->net_total,
            'payment_mode' => $request->payment_mode,
            'status' => 'Completed',
   'remarks' => $request->remarks ?? '',

        ]);

        // Insert items based on your NEW table structure
        foreach ($request->items as $item) {
            SalesInvoiceItem::create([
                'sales_invoice_id' => $invoice->sales_invoice_id,
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity'],
                'unit_price' => $item['unit_price'],
                'discount_amount' => $item['discount_amount'],
                'tax_percent' => $item['tax_percent'],
                'grand_total' => $item['grand_total'],
            ]);
        }

        return response()->json([
            'message' => 'Invoice saved successfully',
            'invoice' => $invoice
        ], 201);
    }

    /**
     * Show one invoice by ID.
     */
    public function show($id)
    {
        $invoice = SalesInvoice::with([
            'customer',
            'items.product'
        ])->find($id);

        if (!$invoice) {
            return response()->json(['message' => 'Invoice not found'], 404);
        }

        return $invoice;
    }

    /**
     * Delete an invoice.
     */
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
