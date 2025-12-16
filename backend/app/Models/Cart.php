<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    protected $table = 'carts';            // plural
    protected $primaryKey = 'cart_id';

    public $incrementing = false;         // because cart_id is set by frontend
    protected $keyType = 'string';        // if using string IDs

    protected $fillable = [
        'cart_id',
        'user_id'
    ];

    public function items()
    {
        return $this->hasMany(CartItem::class, 'cart_id', 'cart_id');
    }
}
