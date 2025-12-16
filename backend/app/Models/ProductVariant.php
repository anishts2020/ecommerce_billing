<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductVariant extends Model
{
    protected $table = 'product_variants'; // ensure correct table
    protected $primaryKey = 'id';          // your table uses id

    protected $fillable = [
        'product_id',
        'color_id',
        'size_id'
    ];

    public function product()
    {
        return $this->belongsTo(Products::class, 'product_id', 'product_id');
    }

    public function color()
    {
        return $this->belongsTo(Color::class, 'color_id', 'color_id');
    }

    public function size()
    {
        return $this->belongsTo(ProductSize::class, 'size_id', 'size_id');
    }
}
