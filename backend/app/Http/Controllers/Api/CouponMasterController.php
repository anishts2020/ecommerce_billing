<?php

namespace App\Http\Controllers\Api;

use App\Models\CouponMaster;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;

class CouponMasterController extends Controller
{
    /**
     * List coupons (with optional search & pagination)
     */
    public function index(Request $request): JsonResponse
    {
        $q = $request->query('q');
        $perPage = (int) $request->query('per_page', 15);

        $query = CouponMaster::query()->orderByDesc('coupon_master_id');

        if ($q) {
            $query->where(function ($w) use ($q) {
                $w->where('coupon_code', 'like', "%{$q}%")
                  ->orWhere('description', 'like', "%{$q}%");
            });
        }

        $paginated = $query->paginate($perPage);

        return response()->json($paginated);
    }

    /**
     * Store a new coupon
     */
    public function store(Request $request): JsonResponse
    {
        $data = $this->validateData($request);

        $data['is_active'] = isset($data['is_active']) ? (int) $data['is_active'] : 1;

        $coupon = CouponMaster::create($data);

        return response()->json([
            'message' => 'Coupon created successfully',
            'data' => $coupon,
        ], 201);
    }

    /**
     * Show coupon
     */
    public function show(CouponMaster $couponMaster): JsonResponse
    {
        return response()->json($couponMaster);
    }

    /**
     * Update coupon
     */
    public function update(Request $request, CouponMaster $couponMaster): JsonResponse
    {
        $data = $this->validateData($request, $couponMaster->coupon_master_id);

        if (isset($data['is_active'])) {
            $data['is_active'] = (int) $data['is_active'];
        }

        $couponMaster->update($data);

        return response()->json([
            'message' => 'Coupon updated successfully',
            'data' => $couponMaster->fresh(),
        ]);
    }

    /**
     * Delete coupon
     */
    public function destroy(CouponMaster $couponMaster): JsonResponse
    {
        $couponMaster->delete();

        return response()->json(['message' => 'Coupon deleted successfully']);
    }

 

    /**
     * Validate incoming request
     */
    protected function validateData(Request $request, $ignoreId = null): array
    {
        $rules = [
            'coupon_code' => [
                'required',
                'string',
                'max:100',
                $ignoreId ? Rule::unique('coupons_master', 'coupon_code')->ignore($ignoreId, 'coupon_master_id') : 'unique:coupons_master,coupon_code'
            ],
            'description' => ['nullable','string','max:255'],
            'discount_type' => ['nullable','integer'], // 0 = percentage, 1 = fixed
            'discount_value' => ['nullable','numeric','min:0'],
            'minimum_order_amount' => ['nullable','numeric','min:0'],
            'maximum_discount_amount' => ['nullable','numeric','min:0'],
            'usage_limit' => ['nullable','integer','min:0'],
            'usage_limit_per_user' => ['nullable','integer','min:0'],
            'valid_from' => ['nullable','date'],
            'valid_to' => ['nullable','date','after_or_equal:valid_from'],
            'is_active' => ['nullable','boolean'],
        ];

        return $request->validate($rules);
    }
}
