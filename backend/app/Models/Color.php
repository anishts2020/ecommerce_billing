<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Color extends Model {

      
    
    protected $primaryKey = 'color_id'; // correct primary key

    protected $fillable = ['color_name', 'color_code', 'is_active'];
}
