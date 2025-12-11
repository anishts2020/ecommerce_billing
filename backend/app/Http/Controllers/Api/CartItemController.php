<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CartItem;

class CartItemController extends Controller
{
    public function destroy($id)
    {
        $item = CartItem::find($id);

        if (!$item) {
            return response()->json(['message' => 'Cart item not found'], 404);
        }

        $item->delete();

        return response()->json(['message' => 'Item removed successfully']);
    }
}
