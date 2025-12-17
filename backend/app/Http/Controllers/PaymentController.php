<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payment;
use App\Models\CustomerOrderTask;
use App\Models\Order;

class PaymentController extends Controller
{
    public function store(Request $request)
    {
        $order = Order::where('order_id', $request->order_id)->first();
        $payment = Payment::create([
            'order_id'        => $request->order_id,
            'transaction_id'  => $request->transaction_id,
            'amount'          => $request->amount,
            'payment_date'    => now(),
            'payment_mode'    => $request->payment_mode,
            'payment_status'  => $request->payment_status,
        ]);

        CustomerOrderTask::create([
            'order_id'       => $request->order_id,
            'amount'         => $request->amount,
            'payment_date'   => now(),
            'payment_mode'  => $request->payment_mode,
            'order_date'     => $order->created_at,
            'payment_status' => $request->payment_status,
            'order_status'   => 'inprogress',
        ]);

        return response()->json([
            'message' => 'Payment + Order recorded successfully',
            'payment' => $payment
        ]);
    }
}
