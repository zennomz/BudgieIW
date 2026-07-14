<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Account extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'balance',
        'rate_remuneration',
        'rate_imposition',
        'user_id',
    ];

    protected $casts = [
        'balance' => 'decimal:2',
        'rate_remuneration' => 'decimal:2',
        'rate_imposition' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function previsions()
    {
        return $this->hasMany(Prevision::class);
    }

    public function incomes()
    {
        return $this->hasMany(Income::class);
    }

    public function expenses()
    {
        return $this->hasMany(Expense::class);
    }

    public function shares()
    {
        return $this->hasMany(AccountShare::class);
    }

    public function isOwnedBy(?User $user): bool
    {
        return $user !== null && $this->user_id === $user->id;
    }

    public function isAccessibleBy(?User $user): bool
    {
        if ($user === null) {
            return false;
        }

        if ($this->isOwnedBy($user)) {
            return true;
        }

        return $this->shares()
            ->where('user_id', $user->id)
            ->where('status', AccountShare::STATUS_ACCEPTED)
            ->exists();
    }
}
