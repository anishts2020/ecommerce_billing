<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Materials extends Model
{

       protected $primaryKey = 'material_id';

    // If `material_id` is an integer and auto-incrementing (typical), keep these defaults:
    public $incrementing = true;
    protected $keyType = 'int';
    use HasFactory;
     protected $fillable = ['material_name','description',];
}
