<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class EcommerceLogin extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    // Use the existing users table
    protected $table = 'users';

    // Primary key (if default 'id' is used, you can omit)
    protected $primaryKey = 'id';

    // Fillable fields (adjust if your users table has different columns)
    protected $fillable = [
        'name',
        'email',
        'password',
        'is_active',
        // add other user columns you want to mass-assign
    ];

    // Hidden fields when serializing
    protected $hidden = [
        'password',
        'remember_token',
    ];

    // Casts
    protected $casts = [
        'email_verified_at' => 'datetime',
        'is_active' => 'boolean',
    ];
}
