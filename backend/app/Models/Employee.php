<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;
    protected $fillable = [
        'employee_code',
        'employee_name',
        'phone',
        'email',
        'address',
        'joining_date',
        'designation',
        'salary_type',
        'base_salary',
        'is_active',
    ];
    protected $casts = [
        'is_active' => 'integer',  // ← add this
    ];
}
