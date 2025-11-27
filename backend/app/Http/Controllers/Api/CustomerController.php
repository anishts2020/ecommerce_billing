<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Customer;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
       return Customer::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
       $request->validate([
           'customer_name' => 'required|string',
           'phone' => 'required|unique:customers',
           'email' => 'required|email|unique:customers',
           'address' => 'required|string',
           'city' => 'required|string',
           'state' => 'required|string',
           'pincode' => 'required|string',
           'gst_number' => 'nullable|string',
       ]);
       return Customer::create($request->all());
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return Customer::findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
       $customer = Customer::findOrFail($id);
        $customer->update($request->all());
        return $customer;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
       return Customer::destroy($id);
    }

    public function checkByPhone($phone)
{
    $customer = Customer::where('phone', $phone)->first();

    if ($customer) {
        return response()->json([
            'exists' => true,
            'data' => $customer
        ]);
    }

    return response()->json([
        'exists' => false
    ]);
}
}





