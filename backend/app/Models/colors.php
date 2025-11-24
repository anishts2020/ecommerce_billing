<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class colors extends Model
{
    use HasFactory;

    protected $primaryKey = 'color_id';

    protected $fillable = [
        'color_name',
        'color_code',
        'is_active'
        ];
}
