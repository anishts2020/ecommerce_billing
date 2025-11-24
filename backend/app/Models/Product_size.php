<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product_size extends Model
{
    use HasFactory;

    protected $primaryKey = 'product_size_id';

    protected $fillable = [
        'size_name',
        'description',
        'is_active'
    ];
}
