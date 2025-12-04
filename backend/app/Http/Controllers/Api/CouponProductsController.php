<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CouponProducts;

class CouponProductsController extends Controller
{
    // LIST ALL
    public function index()
    {
        return CouponProducts::with(['coupon', 'product'])
            ->whereHas('coupon')
            ->whereHas('product')
            ->get();
    }

    // ADD
    public function store(Request $request)
    {
        $data = $request->validate([
            'coupon_id' => 'required|exists:coupons_master,coupon_master_id',
            'product_id' => 'required|exists:products,product_id',
        ]);

        return CouponProducts::create($data);
    }

    // UPDATE
    public function update(Request $request, $id)
    {
        $couponProduct = CouponProducts::findOrFail($id);

        $data = $request->validate([
            'coupon_id' => 'required|exists:coupons_master,coupon_master_id',
            'product_id' => 'required|exists:products,product_id',
        ]);

        $couponProduct->update($data);

        return $couponProduct;
    }

    // DELETE
    public function destroy($id)
    {
        $couponProduct = CouponProducts::findOrFail($id);
        $couponProduct->delete();

        return response()->json(['message' => 'Deleted successfully']);
    }
}
