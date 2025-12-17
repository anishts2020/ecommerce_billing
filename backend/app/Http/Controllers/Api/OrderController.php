<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Cart;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|numeric',
            'total_amount' => 'required|numeric',
            'gst_amount' => 'required|numeric',
            'grand_total' => 'required|numeric',
            'billing_address' => 'required|string',
            'shipping_address' => 'required|string',
            'items' => 'required|array',
            'payment_mode' => 'required|string',
            'cart_id' => 'nullable'
        ]);

        // ⭐ Generate Order Number (your format)
        $latestOrder = Order::orderBy('order_id', 'DESC')->first();
        $nextId = $latestOrder ? $latestOrder->order_id + 1 : 1;
        $orderNo = 'ORD-' . str_pad($nextId, 4, '0', STR_PAD_LEFT);

        // ⭐ Create Order
        $order = Order::create([
            'order_no' => $orderNo,
            'user_id' => $request->user_id,
            'total_amount' => $request->total_amount,
            'gst_amount' => $request->gst_amount,
            'grand_total' => $request->grand_total,
            'payment_status' => $request->payment_mode === 'COD' ? 'pending' : 'paid',
            'payment_mode' => $request->payment_mode,
            'order_status' => 'placed',
            'billing_address' => $request->billing_address,
            'shipping_address' => $request->shipping_address,
        ]);

        // ⭐ Save Order Items
        foreach ($request->items as $item) {
            OrderItem::create([
                'order_id' => $order->order_id,
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity'],
                'price' => $item['price'],
                'subtotal' => $item['subtotal'],
            ]);
        }

        // ⭐ Clear Cart (optional)
        if ($request->filled('cart_id')) {
            try {
                $cart = Cart::find($request->cart_id);
                if ($cart) {
                    $cart->items()->delete();
                    $cart->delete();
                }
            } catch (\Exception $e) {
                \Log::error("Cart deletion error: " . $e->getMessage());
            }
        }

        return response()->json([
            'message' => 'Order Created Successfully',
            'order_id' => $order->order_id,
            'order_no' => $order->order_no,
            'amount' => $order->grand_total,
            'order_date' => $order->created_at,
        ]);
    }
    public function generateOrderNo()
{
    try {
        $latestOrder = Order::orderBy('order_id', 'DESC')->first();

        if (!$latestOrder || !$latestOrder->order_no) {
            return response()->json(['order_no' => 'ORD-0001']);
        }

        $number = (int) str_replace('ORD-', '', $latestOrder->order_no);
        $next = $number + 1;

        return response()->json([
            'order_no' => 'ORD-' . str_pad($next, 4, '0', STR_PAD_LEFT)
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'error' => $e->getMessage()
        ], 500);
    }
}

    public function show($id)
    {
        return Order::with('items.product')->find($id);
    }
    public function index()
    {
        return Order::all();
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
