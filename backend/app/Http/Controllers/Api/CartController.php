<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Products;
use Illuminate\Http\Request;

class CartController extends Controller
{
    // Add product to cart
    public function addItem(Request $request)
    {
        $request->validate([
            'cart_id'    => 'required',
            'product_id' => 'required'
        ]);
    
        // ensure cart record exists
        $cart = \App\Models\Cart::firstOrCreate(
            ['cart_id' => (string) $request->cart_id],
            ['user_id' => null]
        );
    
        $product = \App\Models\Products::where('product_id', $request->product_id)->first();
    
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }
    
        $item = \App\Models\CartItem::create([
            'cart_id'    => $cart->cart_id,
            'product_id' => $product->product_id,
            'price'      => $product->selling_price,
            'quantity'   => 1,
            'subtotal'   => $product->selling_price,
        ]);
    
        return response()->json(['message' => 'Added to cart', 'item' => $item], 201);

        
        
    }
    
    // View cart
    public function getCart($cartId)
    {
        $items = CartItem::with('product')->where('cart_id', $cartId)->get();
        return response()->json($items);
    }

    public function updateQty(Request $request)
{
    $request->validate([
        'cart_item_id' => 'required|integer',
        'quantity' => 'required|integer|min:1',
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
