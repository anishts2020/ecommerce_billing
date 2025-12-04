<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CouponProducts extends Model
{
    protected $table = 'coupon_products';

    protected $fillable = ['coupon_id', 'product_id'];

    public function coupon()
    {
        return $this->belongsTo(CouponMaster::class, 'coupon_id', 'coupon_master_id');
    }

    public function product()
    {
        return $this->belongsTo(Products::class, 'product_id', 'product_id');
    }
}
