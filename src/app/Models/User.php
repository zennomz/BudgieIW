<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'firstname',
        'lastname',
        'date_of_birth',
        'numero_phone',
        'email',
        'password',
        'role',
        'plan',
        'token',
        'verification_token',
        'is_active',
    ];

    protected $hidden = [
        'password',
    ];

    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date',
            'is_active' => 'boolean',
            'password' => 'hashed',
        ];
    }

    public function accounts()
    {
        return $this->hasMany(Account::class);
    }

    /**
     * Comptes partagés avec cet utilisateur (accès en lecture seule).
     */
    public function sharedAccounts()
    {
        return $this->belongsToMany(Account::class, 'account_shares')
            ->wherePivot('status', AccountShare::STATUS_ACCEPTED);
    }

    /**
     * premium ou gratos ?
     */
    public function isPremium(): bool
    {
        return $this->plan === 'premium';
    }
}
