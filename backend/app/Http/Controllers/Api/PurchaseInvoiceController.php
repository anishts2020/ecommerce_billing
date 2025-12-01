<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\PurchaseInvoice;
use App\Models\PurchaseInvoiceItem;
use Illuminate\Validation\Rule;

class PurchaseInvoiceController extends Controller
{
    public function index()
    {
        $invoices = PurchaseInvoice::with(['vendor', 'items.product'])
            ->orderBy('purchase_id', 'desc')
            ->get();

        return response()->json($invoices);
    }

    public function show(PurchaseInvoice $invoice)
    {
        $invoice->load(['vendor', 'items.product']);
        return response()->json($invoice);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'vendor_id'              => 'required|integer',
            'payment_status'         => ['required','integer'],
            'remark'                 => 'nullable|string',
            'items'                  => 'required|array|min:1',
            'items.*.product_id'     => 'required|integer',
            'items.*.quantity'       => 'required|numeric|min:0',
            'items.*.unit_cost'      => 'required|numeric',
            'items.*.tax_percent'    => 'nullable|numeric',
        ]);

        try {
            DB::transaction(function() use ($validated, &$createdInvoice) {
                $now = now();
                $totalAmount = 0;
                $taxAmount   = 0;
                $itemsToInsert = [];

                // Calculate each item total including tax
                foreach ($validated['items'] as $it) {
                    $quantity   = number_format($it['quantity'], 2, '.', '');
                    $unitCost   = number_format($it['unit_cost'], 2, '.', '');
                    $taxPercent = isset($it['tax_percent']) ? number_format($it['tax_percent'], 2, '.', '') : 0;

                    $itemTotal = $quantity * $unitCost;
                    $itemTax   = $itemTotal * ($taxPercent / 100);
                    $itemTotalWithTax = number_format($itemTotal + $itemTax, 2, '.', '');

                    $totalAmount += $itemTotal;
                    $taxAmount   += $itemTax;

                    $itemsToInsert[] = [
                        'purchase_id'  => 0, // temporary, will set after invoice created
                        'product_id'   => $it['product_id'],
                        'quantity'     => $quantity,
                        'unit_cost'    => $unitCost,
                        'tax_percent'  => $taxPercent,
                        'total'        => $itemTotalWithTax,
                        'created_at'   => $now,
                        'updated_at'   => $now,
                    ];
                }

                $netAmount = $totalAmount + $taxAmount;

                // Create invoice
                $createdInvoice = PurchaseInvoice::create([
                    'purchase_no'    => $this->generatePurchaseNo(),
                    'purchase_date'  => $now,
                    'vendor_id'      => $validated['vendor_id'],
                    'created_by'     => auth()->id() ?? 0,
                    'total_amount'   => number_format($totalAmount, 2, '.', ''),
                    'tax_amount'     => number_format($taxAmount, 2, '.', ''),
                    'net_amount'     => number_format($netAmount, 2, '.', ''),
                    'payment_status' => $validated['payment_status'],
                    'remark'         => $validated['remark'] ?? null,
                    'created_at'     => $now,
                    'updated_at'     => $now,
                ]);

                // Insert items with correct purchase_id
                foreach ($itemsToInsert as &$item) {
                    $item['purchase_id'] = $createdInvoice->purchase_id;
                }
                PurchaseInvoiceItem::insert($itemsToInsert);
            });

            $createdInvoice = PurchaseInvoice::with(['vendor', 'items.product'])
                ->find($createdInvoice->purchase_id);

            return response()->json([
                'status'  => 'success',
                'message' => 'Invoice saved successfully',
                'data'    => $createdInvoice,
            ], 201);

        } catch (\Exception $e) {
            \Log::error('Purchase invoice store error: '.$e->getMessage());
            return response()->json([
                'status'  => 'error',
                'message' => 'Failed to save invoice: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function destroy(PurchaseInvoice $invoice)
    {
        try {
            DB::transaction(function() use ($invoice) {
                PurchaseInvoiceItem::where('purchase_id', $invoice->purchase_id)->delete();
                $invoice->delete();
            });

            return response()->json([
                'status'  => 'success',
                'message' => 'Invoice deleted successfully',
            ]);
        } catch (\Exception $e) {
            \Log::error('Purchase invoice delete error: '.$e->getMessage());
            return response()->json([
                'status'  => 'error',
                'message' => 'Failed to delete invoice: ' . $e->getMessage(),
            ], 500);
        }
    }

    private function generatePurchaseNo()
    {
        $prefix = 'INV-' . now()->format('Ymd') . '-';
        $last   = PurchaseInvoice::orderBy('purchase_id', 'desc')->first();
        $num    = $last ? ($last->purchase_id + 1) : 1;
        return $prefix . str_pad($num, 4, '0', STR_PAD_LEFT);
    }
}
