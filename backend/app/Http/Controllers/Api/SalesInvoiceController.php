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
     * Store invoice + items
     * Store a new invoice with items.
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
            'items'        => 'required|array',
        ]);

        // Create the main invoice
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

            // Calculate total quantity across all items
        $totalQty = collect($request->items)->sum('quantity');

        // Prevent division by zero
        if ($totalQty == 0) {
            $totalQty = 1;
        }

        // Insert items (AUTO-FILL discount & tax)
            foreach ($request->items as $item) {

    // Distribute discount & tax proportionally
    $itemDiscount = ($request->discount / $totalQty) * $item['quantity'];
    $itemTax      = ($request->tax / $totalQty) * $item['quantity'];

    SalesInvoiceItem::create([
        'sales_invoice_id' => $invoice->sales_invoice_id,
        'product_id'       => $item['product_id'] ?? null,
        'quantity'         => $item['quantity'] ?? 0,
        'unit_price'       => $item['unit_price'] ?? 0,

        // SAVE THE CALCULATED VALUES
        'discount_amount'  => round($itemDiscount, 2),
        'tax_percent'      => round($itemTax, 2),

        'grand_total'      => $item['grand_total'] ?? 0,
    ]);
}



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
     * Return single invoice + mapped items
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

        // Clean structured response
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
     * Return items only — used in your React table
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

    /**
     * Delete invoice
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
