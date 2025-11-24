<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product_categories  extends Model
{
    use HasFactory;

    protected $table = 'product_categories'; 

    protected $primaryKey = 'product_category_id';

    protected $fillable = [
        'product_category_name',
        'description',
        'is_active'
    ];
}
