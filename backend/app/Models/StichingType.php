<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StichingType extends Model
{
     use HasFactory;
    protected $table = 'stiching_types';
     protected $primaryKey = 'stiching_type_id';
      public $incrementing = true;   // 🔥 REQUIRED
    protected $keyType = 'int'; 
   
     protected $fillable = [
        'name',
        'rate'
    ];
}
