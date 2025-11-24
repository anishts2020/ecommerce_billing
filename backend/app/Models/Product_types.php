<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product_types extends Model
{
    use HasFactory;

    protected $primaryKey = 'product_type_id';

    protected $fillable = [
        'product_type_name',
        'description',
        'is_active'
    ];
}
