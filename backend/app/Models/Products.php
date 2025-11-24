<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Products extends Model
{
    protected $primaryKey = 'product_id';

    protected $fillable = [
        'product_code','sku','product_name','product_description',
        'category_id','type_id','color_id','size_id','vendor_id',
        'unit_of_measure','quantity_on_hand','min_stock_level',
        'cost_price','selling_price','tax_percent','is_published','is_active'
    ];

    public function category()
    {
        return $this->belongsTo(Product_categories::class, 'category_id', 'product_category_id');
    }

    public function type()
    {
        return $this->belongsTo(Product_types::class, 'type_id', 'product_type_id');
    }

    public function color()
    {
        return $this->belongsTo(colors::class, 'color_id', 'color_id');
    }

    public function size()
    {
        return $this->belongsTo(Product_size::class, 'size_id', 'product_size_id');
    }

    public function vendor()
    {
        return $this->belongsTo(Vendors::class, 'vendor_id', 'vendor_id');
    }
}
