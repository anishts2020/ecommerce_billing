<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductImage extends Model
{
    protected $table = 'product_image_table';
    protected $primaryKey = 'product_image_id';

    protected $fillable = [
        'product_id',
        'product_code',
        'image'
    ];

    public function product()
    {
        return $this->belongsTo(Products::class, 'product_id', 'product_id');
    }
}
