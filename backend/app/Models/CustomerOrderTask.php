<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerOrderTask extends Model
{
    use HasFactory;
    protected $table = 'customer_order_task';

    protected $fillable = [
        'order_id',
        'amount',
        'payment_date',
        'order_date',
        'payment_status',
        'order_status',
    ];
     public function order()
    {
        return $this->belongsTo(
            Order::class,
            'order_id',   // foreign key in customer_order_tasks
            'order_id'    // primary key in orders table
        );
    }
}
