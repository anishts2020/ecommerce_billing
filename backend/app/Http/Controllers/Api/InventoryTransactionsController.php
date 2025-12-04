<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InventoryTransactions;
use Illuminate\Http\Request;

class InventoryTransactionsController extends Controller
{
    // LIST ALL TRANSACTIONS
    public function index()
    {
        $transactions = InventoryTransactions::with(['product', 'transactionType', 'reference'])
        ->whereHas('product')
        ->whereHas('transactionType')
        ->whereHas('reference')
        ->get();

        $transactions = $transactions->map(function($tr) {
            return [
                'inventory_id' => $tr->inventory_id,
                'product_name' => $tr->product->product_name ?? '-',
                'transaction_type_name' => $tr->transactionType->transaction_type ?? 'N/A',
                'reference_name' => $tr->reference->reference_table ?? '-',
                'quantity' => $tr->quantity,
                'unit_cost' => $tr->unit_cost,
                'transaction_date' => $tr->transaction_date,
                'remarks' => $tr->remarks,
                'product_id' => $tr->product_id,
                'transaction_type' => $tr->transaction_type,
                'reference_table' => $tr->reference_table,
                'reference_id' => $tr->reference_id,
                'created_by' => $tr->created_by,
            ];
        });

        return response()->json($transactions);
    }

    // SHOW SINGLE TRANSACTION
    public function show($id)
    {
        $transaction = InventoryTransactions::with(['product', 'transactionType', 'reference'])->find($id);

        if (!$transaction) {
            return response()->json(['message' => 'Transaction not found'], 404);
        }

        return response()->json($transaction);
    }

    // STORE TRANSACTION
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|integer',
            'transaction_type' => 'required|integer',
            'reference_table' => 'required|integer',
            'reference_id' => 'nullable|integer',
            'quantity' => 'required|integer',
            'unit_cost' => 'required|numeric',
            'transaction_date' => 'required|date',
            'remarks' => 'nullable|string',
            'created_by' => 'nullable|integer',
        ]);

        $transaction = InventoryTransactions::create($validated);

        return response()->json($transaction, 201);
    }

    // UPDATE
    public function update(Request $request, $id)
    {
        $transaction = InventoryTransactions::findOrFail($id);

        $validated = $request->validate([
            'product_id' => 'required|integer',
            'transaction_type' => 'required|integer',
            'reference_table' => 'required|integer',
            'reference_id' => 'nullable|integer',
            'quantity' => 'required|integer',
            'unit_cost' => 'required|numeric',
            'transaction_date' => 'required|date',
            'remarks' => 'nullable|string',
            'created_by' => 'nullable|integer',
        ]);

        $transaction->update($validated);

        return response()->json($transaction);
    }

    // DELETE
    public function destroy($id)
    {
        InventoryTransactions::findOrFail($id)->delete();

        return response()->json(['message' => 'Deleted Successfully']);
    }
}
