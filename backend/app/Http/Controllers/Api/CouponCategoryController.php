<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CouponCategoryController extends Controller
{
    /**
     * Display all coupon-category mappings.
     */
    public function index()
    {
        $data = DB::table('coupon_categories_table as cc')
            ->leftJoin('coupons_master as c', 'cc.coupon_id', '=', 'c.coupon_master_id')
            ->leftJoin('product_categories as pc', 'cc.category_id', '=', 'pc.product_category_id')
            ->select(
                'cc.id',
                'cc.coupon_id',
                'cc.category_id',
                'c.coupon_code',
                'pc.product_category_name',
                'cc.created_at'
            )
            ->orderBy('cc.id', 'DESC')
            ->get();

        return response()->json([
            'status' => true,
            'data' => $data
        ]);
    }

    /**
     * Store a new coupon-category mapping.
     */
    public function store(Request $request)
    {
        $request->validate([
            'coupon_id' => 'required|integer|exists:coupons_master,coupon_master_id',
            'category_id' => 'required|integer|exists:product_categories,product_category_id',
        ]);

        $exists = DB::table('coupon_categories_table')
            ->where('coupon_id', $request->coupon_id)
            ->where('category_id', $request->category_id)
            ->exists();

        if ($exists) {
            return response()->json([
                'status' => false,
                'message' => 'This coupon is already assigned to the selected category.'
            ], 409);
        }

        $data = [
            'coupon_id' => $request->coupon_id,
            'category_id' => $request->category_id,
            'created_at' => now(),
            'updated_at' => now(),
        ];

        DB::table('coupon_categories_table')->insert($data);

        return response()->json([
            'status' => true,
            'message' => 'Coupon assigned to category successfully',
            'data' => $data
        ], 201);
    }

    /**
     * Update an existing coupon-category mapping.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'coupon_id' => 'required|integer|exists:coupons_master,coupon_master_id',
            'category_id' => 'required|integer|exists:product_categories,product_category_id',
        ]);

        $exists = DB::table('coupon_categories_table')
            ->where('coupon_id', $request->coupon_id)
            ->where('category_id', $request->category_id)
            ->where('id', '!=', $id)
            ->exists();

        if ($exists) {
            return response()->json([
                'status' => false,
                'message' => 'This coupon is already assigned to the selected category.'
            ], 409);
        }

        $updated = DB::table('coupon_categories_table')
            ->where('id', $id)
            ->update([
                'coupon_id' => $request->coupon_id,
                'category_id' => $request->category_id,
                'updated_at' => now(),
            ]);

        if (!$updated) {
            return response()->json([
                'status' => false,
                'message' => 'Mapping not found or not updated'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'message' => 'Coupon-category mapping updated successfully'
        ]);
    }

    /**
     * Delete a coupon-category mapping.
     */
    public function destroy($id)
    {
        $deleted = DB::table('coupon_categories_table')
            ->where('id', $id)
            ->delete();

        if (!$deleted) {
            return response()->json([
                'status' => false,
                'message' => 'Mapping not found'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'message' => 'Coupon-category mapping deleted successfully'
        ]);
    }
}
