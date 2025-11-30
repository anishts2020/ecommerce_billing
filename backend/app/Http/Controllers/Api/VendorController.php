<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vendor;
use Illuminate\Http\Request;

class VendorController extends Controller
{
    // GET ALL VENDORS
    public function index(Request $request)
{
    $query = \App\Models\Vendor::query();

    // SEARCH
    if ($request->has('search') && $request->search != '') {
        $search = $request->search;
        $query->where('vendor_name', 'like', "%$search%")
              ->orWhere('email', 'like', "%$search%")
              ->orWhere('phone', 'like', "%$search%");
    }

    // PAGINATION
    $perPage = $request->get('per_page', 10);
    $vendors = $query->orderBy('vendor_name', 'asc')->paginate($perPage);

    return response()->json($vendors);
}


    // STORE VENDOR
    public function store(Request $request)
    {
        $request->validate([
            'vendor_name' => 'required|string|max:255',
            'email' => 'required|email|unique:vendors,email',
            'phone' => 'required|digits:10|unique:vendors,phone',
            'address' => 'required',
            'city' => 'required',
            'state' => 'required',
            'pincode' => 'required|numeric',
            'gst_number' => 'required|string|size:15|unique:vendors,gst_number',
        ]);

        return Vendor::create($request->all());
    }

    // UPDATE VENDOR
    public function update(Request $request, $id)
    {
        $request->validate([
            'vendor_name' => 'required|string|max:255',
            'email' => 'required|email|unique:vendors,email,' . $id . ',vendor_id',
            'phone' => 'required|digits:10|unique:vendors,phone,' . $id . ',vendor_id',
            'address' => 'required',
            'city' => 'required',
            'state' => 'required',
            'pincode' => 'required|numeric',
            'gst_number' => 'required|string|size:15|unique:vendors,gst_number,' . $id . ',vendor_id',
        ]);

        $vendor = Vendor::where('vendor_id', $id)->firstOrFail();
        $vendor->update($request->all());

        return response()->json(['message' => 'Vendor updated successfully']);
    }

    // DELETE VENDOR
    public function destroy($id)
    {
        $vendor = Vendor::where('vendor_id', $id)->firstOrFail();
        $vendor->delete();

        return response()->json(['message' => 'Vendor deleted successfully']);
    }
}
