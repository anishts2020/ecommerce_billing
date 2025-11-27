<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Products extends Model
{
    use HasFactory;
  

  protected $primaryKey = 'product_id'; 


  protected $fillable =  ['product_code',
    'product_name',
      'unit_of_measure',
        'selling_price',   ];
       

}