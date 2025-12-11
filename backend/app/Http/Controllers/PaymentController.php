<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payment;

class PaymentController extends Controller
{
    public function store(Request $request)
    {
        $payment = Payment::create([
            'order_id'        => $request->order_id,
            'transaction_id'  => $request->transaction_id,
            'amount'          => $request->amount,
            'payment_date'    => now(),
            'payment_mode'    => $request->payment_mode,
            'payment_status'  => $request->payment_status,
        ]);

        return response()->json([
            'message' => 'Payment recorded successfully',
            'payment' => $payment
        ]);
    }
}
