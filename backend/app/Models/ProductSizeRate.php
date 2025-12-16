<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductSizeRate extends Model
{
    protected $table = 'product_size_rate';

    protected $fillable = [
        'product_id',
        'size_id',
    ];

    public function size()
    {
        return $this->belongsTo(ProductSize::class, 'size_id');
    }
}
