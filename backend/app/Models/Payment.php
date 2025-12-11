<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $table = 'payment';   // ⭐ YOUR TABLE NAME IS SINGULAR

    protected $primaryKey = 'payment_id';  // ⭐ Your PK column

    protected $fillable = [
        'order_id',
        'transaction_id',
        'amount',
        'payment_date',
        'payment_mode',
        'payment_status',
    ];

    public $timestamps = true;  // because you have created_at, updated_at
}
