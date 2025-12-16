<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductColorRate extends Model
{
    protected $table = 'product_color_rate';

    protected $fillable = [
        'product_id',
        'color_id',
    ];

    public function color()
    {
        return $this->belongsTo(Color::class, 'color_id');
    }
}
