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
}
