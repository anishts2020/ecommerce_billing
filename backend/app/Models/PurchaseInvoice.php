<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PurchaseInvoice extends Model
{
    use HasFactory;

    protected $table = 'purchase_invoices';
    protected $primaryKey = 'purchase_id';

    // Enable automatic timestamps:
    public $timestamps = true;

    // If your timestamp column names are standard (created_at, updated_at),
    // You don’t need to set CREATED_AT or UPDATED_AT constants.

    protected $fillable = [
        'purchase_no',
        'purchase_date',
        'vendor_id',
        'created_by',
        'total_amount',
        'tax_amount',
        'net_amount',
        'payment_status',
        'remark',
        // optionally you can include created_at/updated_at if doing mass assignment
    ];

    public function items()
    {
        return $this->hasMany(PurchaseInvoiceItem::class, 'purchase_id', 'purchase_id');
    }

    public function vendor()
    {
        return $this->belongsTo(Vendor::class, 'vendor_id', 'vendor_id');
    }
}
