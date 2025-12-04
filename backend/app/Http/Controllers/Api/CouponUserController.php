<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CouponUser;
use Illuminate\Http\Request;

class CouponUserController extends Controller
{
    public function index()
    {
        return CouponUser::join('coupons_master', 'coupons_master.coupon_master_id', '=', 'coupon_users.coupon_master_id')
            ->join('users', 'users.id', '=', 'coupon_users.user_id')
            ->select(
                'coupon_users.coupon_user_id',
                'coupon_users.coupon_master_id',
                'coupon_users.user_id',
                'coupon_users.usage_count',
                'coupons_master.coupon_code',
                'users.name'
            )
            ->orderBy('coupon_users.coupon_user_id', 'DESC')
            ->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'coupon_master_id' => 'required|exists:coupons_master,coupon_master_id',
            'user_id' => 'required|exists:users,id',
            'usage_count' => 'required|integer|min:0'
        ]);

        return CouponUser::create($request->all());
    }

    public function show($coupon_user_id)
    {
        return CouponUser::findOrFail($coupon_user_id);
    }

    public function update(Request $request, $coupon_user_id)
    {
        $couponUser = CouponUser::findOrFail($coupon_user_id);

        $request->validate([
            'coupon_master_id' => 'required|exists:coupons_master,coupon_master_id',
            'user_id' => 'required|exists:users,id',
            'usage_count' => 'required|integer|min:0'
        ]);

        $couponUser->update($request->all());

        return response()->json(['message' => 'Updated successfully']);
    }

    public function destroy($coupon_user_id)
    {
        CouponUser::findOrFail($coupon_user_id)->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
