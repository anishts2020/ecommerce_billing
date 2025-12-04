<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CouponMaster extends Model
{
    use HasFactory;

    protected $table = 'coupons_master';
    protected $primaryKey = 'coupon_master_id';
    public $incrementing = true;
    protected $keyType = 'int';

    // Allow mass assignment
    protected $fillable = [
        'coupon_code',
        'description',
        'discount_type',         
        'discount_value',
        'minimum_order_amount',
        'maximum_discount_amount',
        'usage_limit',
        'usage_limit_per_user',
        'valid_from',
        'valid_to',
        'is_active',
    ];

    // Casts
    protected $casts = [
        'discount_value' => 'decimal:2',
        'minimum_order_amount' => 'decimal:2',
        'maximum_discount_amount' => 'decimal:2',
        'usage_limit' => 'integer',
        'usage_limit_per_user' => 'integer',
        'valid_from' => 'date',
        'valid_to' => 'date',
        'is_active' => 'boolean',
    ];

    // Optional: helper accessors
    public function getIsActiveLabelAttribute()
    {
        return $this->is_active ? 'active' : 'inactive';
    }

    // If you prefer constants for discount types:
    public const DISCOUNT_TYPE_PERCENTAGE = 0;
    public const DISCOUNT_TYPE_FIXED = 1;
}
