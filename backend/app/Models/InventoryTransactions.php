<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryTransactions extends Model
{
    use HasFactory;

    protected $table = 'inventory_transactions';
    protected $primaryKey = 'inventory_id';

    protected $fillable = [
        'product_id',
        'transaction_type',
        'reference_table',
        'reference_id',
        'quantity',
        'unit_cost',
        'transaction_date',
        'remarks',
        'created_by',
    ];

    public function product() {
        return $this->belongsTo(Products::class, 'product_id', 'product_id');
    }

    public function transactionType() {
        return $this->belongsTo(TransactionType::class, 'transaction_type', 'id');
    }

    public function reference() {
        return $this->belongsTo(Reference::class, 'reference_table', 'id');
    }
}
