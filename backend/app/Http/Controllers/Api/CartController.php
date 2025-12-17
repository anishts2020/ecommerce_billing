<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Products;

class CartController extends Controller
{
    // =========================
    // ADD ITEM TO CART
    // =========================
    public function addItem(Request $request)
    {
        $request->validate([
            'cart_id'    => 'required',
            'product_id' => 'required|integer'
        ]);

        // Dummy user id
        $DUMMY_USER_ID = 0;

        // Create or get cart
        $cart = Cart::firstOrCreate(
            ['cart_id' => $request->cart_id],
            ['user_id' => $DUMMY_USER_ID]
        );

        // ✅ IMPORTANT: use correct PK
        // If your products table PK = product_id
        $product = Products::where('product_id', $request->product_id)->first();
        // If PK = id, use instead:
        // $product = Products::find($request->product_id);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $item = CartItem::where('cart_id', $cart->cart_id)
                        ->where('product_id', $product->product_id)
                        ->first();

        if ($item) {
            $item->quantity += 1;
            $item->subtotal = $item->quantity * $item->price;
            $item->save();
        } else {
            $item = CartItem::create([
                'cart_id'    => $cart->cart_id,
                'product_id' => $product->product_id,
                'price'      => $product->selling_price,
                'quantity'   => 1,
                'subtotal'   => $product->selling_price,
            ]);
        }

        return response()->json([
            'message' => 'Added to cart',
            'item'    => $item
        ], 201);
    }

    // =========================
    // VIEW CART ITEMS
    // =========================
    public function getCart($cartId)
    {
        return CartItem::with('product')
            ->where('cart_id', $cartId)
            ->get();
    }

    // =========================
    // UPDATE QUANTITY
    // =========================
    public function updateQty(Request $request)
    {
        $request->validate([
            'cart_item_id' => 'required|integer',
            'quantity'     => 'required|integer|min:1',
        ]);

        $item = CartItem::find($request->cart_item_id);

        if (!$item) {
            return response()->json(['message' => 'Cart item not found'], 404);
        }

        $item->quantity = $request->quantity;
        $item->subtotal = $item->price * $request->quantity;
        $item->save();

        return response()->json(['message' => 'Quantity updated']);
    }
}
