<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PurchaseInvoiceItem extends Model
{
    use HasFactory;

    protected $table = 'purchase_invoice_items';
    protected $primaryKey = 'invoice_item_id';
    public $timestamps = true;

    protected $fillable = [
        'purchase_id',
        'product_id',
        'quantity',
        'unit_cost',
        'tax_percent',
        'total',
    ];

    // belongs to parent invoice
    public function purchase()
    {
        return $this->belongsTo(PurchaseInvoice::class, 'purchase_id', 'purchase_id');
    }

    // <-- IMPORTANT: add this relation so `items.product` works in the with()
    public function product()
    {
        // assumes your products table primary key is `product_id`
        return $this->belongsTo(Products::class, 'product_id', 'product_id');
    }
}
