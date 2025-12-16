<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\OrderItem;
use Illuminate\Http\Request;

class OrderItemController extends Controller
{
    public function destroy($id)
    {
        $item = OrderItem::find($id);

        if (!$item) {
            return response()->json(['message' => 'Order item not found'], 404);
        }

        $item->delete();

        return response()->json(['message' => 'Order item removed']);
    }
}
