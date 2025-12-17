<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use  App\Models\CustomerOrderTask;
use App\Models\Order;
use App\Models\Payment;
class CustomerOrderTaskController extends Controller
{
   

public function index()
{
    return CustomerOrderTask::with('order')
        ->get()
        ->map(function ($task) {
            return [
                'id'           => $task->id,
                'order_id'     => $task->order_id,
                'amount'       => $task->amount,
                'payment_date' => $task->payment_date,
                'order_date'   => $task->order_date,
                'payment_mode' => $task->order ? $task->order->payment_mode : null,
                'order_status' => $task->order_status,
            ];
        });
}
public function updateStatus(Request $request, $id)
{
    $request->validate([
        'order_status' => 'required|in:inprogress,delivered,cancelled'
    ]);

    $task = CustomerOrderTask::find($id);

    if (!$task) {
        return response()->json(['message' => 'Task not found'], 404);
    }

    $task->order_status = $request->order_status;
    $task->save();

    return response()->json([
        'message' => 'Status updated successfully',
        'order_status' => $task->order_status
    ]);
}




    public function show($id)
    {
        $task = CustomerOrderTask::find($id);

        if (!$task) {
            return response()->json(['message' => 'Task not found'], 404);
        }

        return response()->json($task);
    }
     public function store(Request $request)
    {
        $task = CustomerOrderTask::create($request->all());

        return response()->json([
            'message' => 'Task created successfully',
            'task' => $task
        ]);
    }
     public function createFromPayment($orderId)
    {
        $order = Order::where('order_id', $orderId)->first();
        $payment = Payment::where('order_id', $orderId)->first();

        if (!$order || !$payment) {
            return null;
        }

        return CustomerOrderTask::create([
            'order_id'       => $order->order_id,
            'amount'         => $payment->amount,
            'payment_date'   => $payment->payment_date,
            'order_date'     => $order->created_at,
            'payment_status' => $payment->payment_status,
            'order_status'   => $order->order_status,
        ]);
    }
}
