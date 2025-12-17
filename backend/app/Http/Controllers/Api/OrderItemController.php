<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class OrderItemController extends Controller
{
    public function byOrder($orderId)
    {
        return DB::table('order_items')
            ->join(
                'products',
                'products.product_id',   // ⬅️ VERY IMPORTANT
                '=',
                'order_items.product_id'
            )
            ->where('order_items.order_id', $orderId)
            ->select(
                'order_items.order_item_id',
                'products.product_name',
                'order_items.price',
                'order_items.quantity',
                'order_items.subtotal'
            )
            ->get();
    }
}
