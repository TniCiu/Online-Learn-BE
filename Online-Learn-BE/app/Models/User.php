<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory;

    protected $fillable = [
        'firstName', 'lastName', 'phoneNumber',
        'email', 'bio', 'avatarUrl', 'password',
    ];

    protected $hidden = ['password'];

    public function getJWTIdentifier() { return $this->getKey(); }
    public function getJWTCustomClaims() { return []; }
}

