<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    // 🟢 Get all employees
    public function index()
    {
        return response()->json(Employee::all());
    }

    // 🟢 Store new employee
    public function store(Request $request)
    {
        $request->validate([
            'employee_code' => 'required|unique:employees',
            'employee_name' => 'required|string',
            'phone' => 'required|unique:employees,phone',
            'email' => 'required|email|unique:employees,email',
            'joining_date' => 'required|date',
            'designation' => 'required|string',
            'salary_type' => 'required|integer',
            'base_salary' => 'required|numeric',
            'is_active' => 'required|boolean',
        ]);

        $employee = Employee::create($request->all());

        return response()->json([
            'message' => 'Employee added successfully',
            'employee' => $employee
        ], 201);
    }

    // 🟢 Get single employee
    public function show($id)
    {
        return Employee::findOrFail($id);
    }

    // 🟢 Update employee
    public function update(Request $request, $id)
    {
        $request->validate([
        'employee_name' => 'required|string',
        'email' => 'required|email|unique:employees,email,' . $id,
        'phone' => 'required|unique:employees,phone,' . $id,
        'salaryType' => 'required|string',
        'salary' => 'required|numeric'
    ]);
        $employee = Employee::findOrFail($id);

        $employee->update($request->all());

        return response()->json([
            'message' => 'Employee updated successfully',
            'employee' => $employee
        ]);
    }

    // 🟢 Delete employee
    public function destroy($id)
    {
        Employee::destroy($id);

        return response()->json(['message' => 'Employee deleted successfully']);
    }
}
