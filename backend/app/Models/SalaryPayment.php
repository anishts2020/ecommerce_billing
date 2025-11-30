<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SalaryPayment extends Model
{
    use HasFactory;
    protected $table = 'salary_payments';

    protected $primaryKey = 'salary_payment_id';

    protected $fillable = [
        'employee_id',
        'salary_month',
        'salary_year',
        'gross_salary',
        'deductions',
        'net_salary',
        'payment_date',
        'payment_mode', 
        'created_by',
        'remarks',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class, 'employee_id');
    }
}
