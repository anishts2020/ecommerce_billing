<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

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
        'cart_id' => 'nullable' // optional, if passed we'll clear cart
    ]);

    $order = Order::create([
        'order_no' => 'ORD-' . time(),
        'user_id' => $request->user_id,
        'total_amount' => $request->total_amount,
        'gst_amount' => $request->gst_amount,
        'grand_total' => $request->grand_total,
        'payment_status' => $request->payment_mode === 'COD' ? 'pending' : 'paid', // adapt as needed
        'payment_mode' => $request->payment_mode,
        'order_status' => 'placed',
        'billing_address' => $request->billing_address,
        'shipping_address' => $request->shipping_address,
    ]);

    foreach ($request->items as $item) {
        OrderItem::create([
            'order_id' => $order->order_id,
            'product_id' => $item['product_id'],
            'quantity' => $item['quantity'],
            'price' => $item['price'],
            'subtotal' => $item['subtotal'],
        ]);
    }

    // If cart_id provided, clear the cart items and delete the cart row
    if ($request->filled('cart_id')) {
        try {
            $cart = Cart::find($request->cart_id);
            if ($cart) {
                $cart->items()->delete(); // remove cart_items
                $cart->delete(); // remove cart row
            }
        } catch (\Exception $e) {
            // Log error but don't fail the order creation
            \Log::error("Failed to clear cart after order: " . $e->getMessage());
        }
    }

    return response()->json([
        'message' => 'Order placed successfully',
        'order' => $order
    ]);
}


    // BUY SINGLE PRODUCT
    public function buySingle(Request $request)
    {
        $request->validate([
            'product_id' => 'required',
            'quantity'   => 'required|numeric',
            'price'      => 'required|numeric',
            'subtotal'   => 'required|numeric',
        ]);

        $order = Order::create([
            'order_no'         => 'ORD-' . time(),
            'user_id' => 0,
            'total_amount'     => $request->subtotal,
            'gst_amount'       => $request->subtotal * 0.05,
            'grand_total'      => $request->subtotal * 1.05,
            'payment_status'   => 'pending',
            'payment_mode'     => 'COD',
            'order_status'     => 'placed',
            'billing_address'  => 'Default Address',
            'shipping_address' => 'Default Address',
        ]);

        OrderItem::create([
            'order_id'   => $order->order_id,
            'product_id' => $request->product_id,
            'quantity'   => $request->quantity,
            'price'      => $request->price,
            'subtotal'   => $request->subtotal,
        ]);

        return response()->json([
            'message'   => 'Order placed',
            'order_id'  => $order->order_id
        ]);
    }

    // CHECKOUT FULL CART
    public function checkout(Request $request)
    {
        $request->validate([
            'cart_id' => 'required'
        ]);

        $cart = Cart::with('items.product')->find($request->cart_id);

        if (!$cart) {
            return response()->json(['message' => 'Cart not found'], 404);
        }

        if ($cart->items->isEmpty()) {
            return response()->json(['message' => 'Cart is empty'], 400);
        }

        $total = $cart->items->sum('subtotal');
        $gst = $total * 0.05;

        $order = Order::create([
            'order_no'         => 'ORD-' . time(),
            'user_id' => $cart->user_id ?? 0,
            'total_amount'     => $total,
            'gst_amount'       => $gst,
            'grand_total'      => $total + $gst,
            'payment_status'   => 'pending',
            'payment_mode'     => 'COD',
            'order_status'     => 'placed',
            'billing_address'  => 'Default Address',
            'shipping_address' => 'Default Address',
        ]);

        foreach ($cart->items as $item) {
            OrderItem::create([
                'order_id'   => $order->order_id,
                'product_id' => $item->product_id,
                'quantity'   => $item->quantity,
                'price'      => $item->price,
                'subtotal'   => $item->subtotal,
            ]);
        }

        // CLEAR CART
        $cart->items()->delete();

        return response()->json([
            'message'  => 'Order placed',
            'order_id' => $order->order_id
        ]);
    }

    // SHOW ORDER
    public function show($id)
    {
        $order = Order::with(['items.product'])->find($id);

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        return $order;
    }
}
