<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Employee;

class EmployeeController extends Controller
{

        // ✔ GET ALL EMPLOYEES
    public function index()
    {
        return response()->json(Employee::all());
    }
    
    public function getByCode($code)
    {
        $employee = Employee::where('employee_code', $code)->first();

        if (!$employee) {
            return response()->json(['message' => 'Employee not found'], 404);
        }

        return response()->json($employee);
    }

     public function show($id)
{
    $employee = Employee::find($id);

    if (!$employee) {
        return response()->json(['status' => false], 404);
    }

    return response()->json([
        'status' => true,
        'data' => $employee
    ]);
}

}
