<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $table = 'order';
    protected $primaryKey = 'order_id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'order_no',
        'user_id',
        'total_amount',
        'gst_amount',
        'grand_total',
        'payment_status',
        'payment_mode',
        'order_status',
        'billing_address',
        'shipping_address',
    ];
}

