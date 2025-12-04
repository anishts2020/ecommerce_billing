<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CouponUser extends Model
{
    protected $table = 'coupon_users';

    // Primary key fix
    protected $primaryKey = 'coupon_user_id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'coupon_master_id',
        'user_id',
        'usage_count',
    ];
}
