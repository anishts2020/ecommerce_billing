<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\PurchaseInvoice;
use App\Models\PurchaseInvoiceItem;

class PurchaseInvoiceController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'vendor_id'        => 'required|integer',
            'total_amount'     => 'required|numeric',
            'tax_amount'       => 'nullable|numeric',
            'net_amount'       => 'required|numeric',
            'payment_status'   => 'required|integer',
            'remark'           => 'nullable|string',
            'items'            => 'required|array|min:1',
            'items.*.product_id'   => 'required|integer',
            'items.*.quantity'     => 'required|numeric|min:0',      // numeric, not integer (quantity can be decimal if allowed)
            'items.*.unit_cost'    => 'required|numeric',
            'items.*.tax_percent'  => 'nullable|numeric',
            'items.*.total'        => 'required|numeric',
        ]);

        try {
            DB::transaction(function() use ($validated) {
                $invoice = PurchaseInvoice::create([
                    'purchase_no'    => $this->generatePurchaseNo(),
                    'purchase_date'  => now(),
                    'vendor_id'      => $validated['vendor_id'],
                    'created_by'     => auth()->id() ?? 0,
                    'total_amount'   => number_format($validated['total_amount'], 2, '.', ''),
                    'tax_amount'     => number_format($validated['tax_amount'] ?? 0, 2, '.', ''),
                    'net_amount'     => number_format($validated['net_amount'], 2, '.', ''),
                    'payment_status' => $validated['payment_status'],
                    'remark'         => $validated['remark'] ?? null,
                    'created_at'     => now(),
                    'updated_at'     => now(),
                ]);

                $now = now();
                $itemsToInsert = [];

                foreach ($validated['items'] as $it) {
                    // Format decimal values as strings to preserve precision
                    $quantity   = number_format($it['quantity'], 2, '.', '');
                    $unitCost   = number_format($it['unit_cost'], 2, '.', '');
                    $taxPercent = isset($it['tax_percent'])
                                   ? number_format($it['tax_percent'], 2, '.', '')
                                   : '0.00';
                    $total      = number_format($it['total'], 2, '.', '');

                    $itemsToInsert[] = [
                        'purchase_id'  => $invoice->purchase_id,
                        'product_id'   => $it['product_id'],
                        'quantity'     => $quantity,
                        'unit_cost'    => $unitCost,
                        'tax_percent'  => $taxPercent,
                        'total'        => $total,
                        'created_at'   => $now,
                        'updated_at'   => $now,
                    ];
                }

                PurchaseInvoiceItem::insert($itemsToInsert);
            });

            return response()->json([
                'status'  => 'success',
                'message' => 'Invoice saved successfully',
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Failed to save invoice: ' . $e->getMessage(),
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
