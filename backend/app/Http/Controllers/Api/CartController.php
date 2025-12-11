<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CartController extends Controller
{
    public function checkout(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'nullable|integer',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|integer',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
        ]);

        $userId = $validated['user_id'] ?? 1;

        DB::beginTransaction();
        try {
            $cartId = DB::table('cart')->insertGetId([
                'user_id' => $userId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $total = 0;
            foreach ($validated['items'] as $item) {
                $subtotal = (int)$item['quantity'] * (float)$item['price'];
                $total += $subtotal;
                DB::table('cart_item')->insert([
                    'cart_id' => $cartId,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'subtotal' => $subtotal,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            DB::commit();
            return response()->json([
                'status' => true,
                'cart_id' => $cartId,
                'items_count' => count($validated['items']),
                'total' => $total,
            ], 201);
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function show($cartId)
    {
        $cart = DB::table('cart')->where('cart_id', $cartId)->first();
        if (!$cart) {
            return response()->json(['status' => false, 'message' => 'Cart not found'], 404);
        }

        $items = DB::table('cart_item as ci')
            ->join('products as p', 'ci.product_id', '=', 'p.product_id')
            ->leftJoin('colors as c', 'p.color_id', '=', 'c.color_id')
            ->leftJoin('product_sizes as s', 'p.size_id', '=', 's.size_id')
            ->select(
                'ci.cart_item_id', 'ci.cart_id', 'ci.product_id', 'ci.quantity', 'ci.price', 'ci.subtotal',
                'p.product_name', 'p.product_image', 'p.selling_price', 'p.quantity_on_hand as stock', 'p.min_stock_level',
                'c.color_name', 's.size_name'
            )
            ->where('ci.cart_id', $cartId)
            ->get();

        $total = $items->sum('subtotal');
        return response()->json(['status' => true, 'cart' => $cart, 'items' => $items, 'total' => $total]);
    }

    public function latest(Request $request)
    {
        $userId = $request->get('user_id', 1);
        $cart = DB::table('cart')
            ->where('user_id', $userId)
            ->orderByDesc('cart_id')
            ->first();
        if (!$cart) {
            return response()->json(['status' => true, 'cart' => null, 'items' => [], 'total' => 0]);
        }
        return $this->show($cart->cart_id);
    }

    public function updateItem(Request $request, $id)
    {
        $validated = $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $item = DB::table('cart_item')->where('cart_item_id', $id)->first();
        if (!$item) {
            return response()->json(['status' => false, 'message' => 'Item not found'], 404);
        }
        $product = DB::table('products')->where('product_id', $item->product_id)->first();
        if ($product && (int)$validated['quantity'] > (int)$product->quantity_on_hand) {
            return response()->json([
                'status' => false,
                'message' => 'Requested quantity exceeds available stock',
                'available' => (int)$product->quantity_on_hand,
            ], 422);
        }

        $subtotal = (int)$validated['quantity'] * (float)$item->price;
        DB::table('cart_item')->where('cart_item_id', $id)->update([
            'quantity' => (int)$validated['quantity'],
            'subtotal' => $subtotal,
            'updated_at' => now(),
        ]);

        return $this->show($item->cart_id);
    }

    public function deleteItem($id)
    {
        $item = DB::table('cart_item')->where('cart_item_id', $id)->first();
        if (!$item) {
            return response()->json(['status' => false, 'message' => 'Item not found'], 404);
        }
        DB::table('cart_item')->where('cart_item_id', $id)->delete();
        return $this->show($item->cart_id);
    }
}

