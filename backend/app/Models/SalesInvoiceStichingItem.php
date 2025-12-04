<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SalesInvoiceStichingItem extends Model
{
    use HasFactory;

    protected $table = 'sales_invoice_stiching_items';

    protected $fillable = [
        'sales_invoice_id',
        'sales_invoice_item_id', // 🔥 ADD THIS
         'customer_id',       // ✅ ADD
         'customer_name',
        'product_id',
            'product_name',
        'stiching_type_id',
        'stiching_type_name',
        'rate',
    ];
    public function product()
{
    return $this->belongsTo(Products::class, 'product_id', 'product_id');
}
public function customer()
{
    return $this->belongsTo(Customer::class, 'customer_id','id');
}


}
