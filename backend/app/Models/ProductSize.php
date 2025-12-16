<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductSize extends Model
{
    use HasFactory;

    protected $table = 'product_sizes';
    protected $primaryKey = 'size_id';

    protected $fillable = [
        'size_name',
        'description',
        'is_active',
    ];

        public function productSizeRates()
    {
        return $this->hasMany(ProductSizeRate::class, 'size_id', 'size_id');
    }

}
