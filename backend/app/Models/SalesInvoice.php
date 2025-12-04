<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SalesInvoice extends Model
{
    use HasFactory;

    protected $primaryKey = 'sales_invoice_id';

    protected $fillable = [
        'invoice_no',
        'invoice_date',
        'customer_id',
        
        'cashier_id',
        'grand_total',
        'discount',
        'tax',
        'net_total',
        'payment_mode',
        'status',
        'remarks',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id','id');
    }

    public function items()
    {
        return $this->hasMany(SalesInvoiceItem::class, 'sales_invoice_id');
    }
    public function stitching()
{
    return $this->hasMany(SalesInvoiceStichingItem::class, 'sales_invoice_id', 'sales_invoice_id');
}
}
