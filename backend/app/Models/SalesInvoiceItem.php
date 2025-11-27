<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SalesInvoiceItem extends Model
{
    use HasFactory;

    protected $primaryKey = 'sales_invoice_item_id';

    protected $fillable = [
        'sales_invoice_id',
        'product_id',
        'quantity',
        'unit_price',
        'discount_amount',
        'tax_percent',
        'grand_total',
    ];

    public function product()
    {
        return $this->belongsTo(Products::class, 'product_id');
    }

    public function invoice()
    {
        return $this->belongsTo(SalesInvoice::class, 'sales_invoice_id');
    }
}
