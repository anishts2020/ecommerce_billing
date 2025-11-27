<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductCategory extends Model
{
    protected $primaryKey = 'product_category_id';
    public $timestamps = false;

    protected $fillable = [
        'product_category_name',
        'description'
        
    ];
}
