<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Products extends Model
{
    protected $table = 'products';   // your table

    protected $fillable = [
        'product_name',
        'selling_price',
        'product_image',
        'product_description',
    ];
}
