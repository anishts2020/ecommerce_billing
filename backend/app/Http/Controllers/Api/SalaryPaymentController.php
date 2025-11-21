<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SalaryPayment;

class SalaryPaymentController extends Controller
{
    /**
     * Get salary by employee
     */
    public function getByEmployee($employee_id)
    {
        try {
            $salary = SalaryPayment::where('employee_id', $employee_id)->get();

            return response()->json([
                'status' => true,
                'data' => $salary
            ]);
        } catch(\Exception $e) {
            return response()->json([
                'status' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a new salary
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id'   => 'required|exists:employee,id',
            'salary_month'  => 'required|integer|min:1|max:12',
            'salary_year'   => 'required|integer|min:2000|max:2100',
            'gross_salary'  => 'required|numeric|min:0',
            'deductions'    => 'nullable|numeric|min:0',
            'net_salary'    => 'required|numeric|min:0',
            'payment_date'  => 'nullable|date',
            'payment_mode'  => 'required|integer|in:1,2,3',
            'remarks'       => 'nullable|string|max:500',
        ]);

        // Prevent duplicate salary (month + year + employee)
        $duplicate = SalaryPayment::where('employee_id', $request->employee_id)
            ->where('salary_month', $request->salary_month)
            ->where('salary_year', $request->salary_year)
            ->exists();

        if ($duplicate) {
            return response()->json([
                'status' => false,
                'message' => 'Salary already added for this month.',
            ], 422);
        }

        $salary = SalaryPayment::create($validated);

        return response()->json([
            'status' => true,
            'data' => $salary
        ], 201);
    }

    /**
     * Update salary
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'salary_month'  => 'required|integer|min:1|max:12',
            'salary_year'   => 'required|integer|min:2000|max:2100',
            'gross_salary'  => 'required|numeric|min:0',
            'deductions'    => 'nullable|numeric|min:0',
            'net_salary'    => 'required|numeric|min:0',
            'payment_date'  => 'nullable|date',
            'payment_mode'  => 'required|integer|in:1,2,3',
            'remarks'       => 'nullable|string|max:500',
        ]);

        $salary = SalaryPayment::findOrFail($id);
        $salary->update($validated);

        return response()->json([
            'status' => true,
            'data' => $salary
        ]);
    }

    /**
     * Delete salary
     */
    public function destroy($id)
    {
        $salary = SalaryPayment::findOrFail($id);
        $salary->delete();

        return response()->json([
            'status' => true,
            'message' => 'Salary deleted successfully'
        ]);
    }
}

