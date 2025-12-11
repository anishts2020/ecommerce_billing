<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;

class OrderController extends Controller
{
    /**
     * Create new order
     */
    public function store(Request $request)
    {
        // STEP 1 → Generate Order Number
        $latestOrder = Order::orderBy('order_id', 'DESC')->first();
        $nextId = $latestOrder ? $latestOrder->order_id + 1 : 1;

        $orderNo = 'ORD-' . str_pad($nextId, 4, '0', STR_PAD_LEFT);

        // STEP 2 → Create Order
        $order = Order::create([
            'order_no'         => $orderNo,
            'user_id'          => $request->user_id,
            'total_amount'     => $request->total_amount,
            'gst_amount'       => $request->gst_amount,
            'grand_total'      => $request->grand_total,
            'payment_status'   => $request->payment_status ?? "pending",
            'payment_mode'     => $request->payment_mode,
            'order_status'     => $request->order_status ?? "processing",
            'billing_address'  => $request->billing_address,
            'shipping_address' => $request->shipping_address,
        ]);

        // STEP 3 → Response
        return response()->json([
            'message'   => 'Order Created Successfully',
            'order_id'  => $order->order_id,
            'order_no'  => $order->order_no,
            'amount'    => $order->grand_total,
        ], 200);
    }

    public function generateOrderNo()
    {
        $latestOrder = Order::orderBy('order_id', 'DESC')->first();

        if (!$latestOrder) {
            $orderNo = 'ORD-0001';
        } else {
            $number = intval(substr($latestOrder->order_no, 4));
            $number++;
            $orderNo = 'ORD-' . str_pad($number, 4, '0', STR_PAD_LEFT);
        }

        return response()->json(['order_no' => $orderNo]);
    }

    public function index()
    {
        return Order::all();
    }

    public function show($id)
    {
        return Order::find($id);
    }

    public function destroy($id)
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json(['error' => 'Order not found'], 404);
        }

        $order->delete();

        return response()->json(['success' => true]);
    }
}
