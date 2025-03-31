<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, HasApiTokens,Notifiable;

    
    protected $fillable = [
        'email',
        'bio',
        'firstName',
        'lastName',
        'phoneNumber',
        'avatarUrl',
        'password',
    ];

   
    protected $hidden = [
        'password',
        'remember_token',
    ];

 
}
