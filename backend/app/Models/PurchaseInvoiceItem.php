<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PurchaseInvoiceItem extends Model
{
    use HasFactory;

    protected $table = 'purchase_invoice_items';

    // If your table has created_at/updated_at and you want them filled manually, keep false
    public $timestamps = false;

    protected $fillable = [
        'purchase_id',
        'product_id',
        'quantity',
        'unit_cost',
        'tax_percent',
        'total',
        'created_at',
        'updated_at',
    ];
}
