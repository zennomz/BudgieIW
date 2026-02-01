<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Prevision extends Model
{
    use HasFactory;

    protected $fillable = [
        'date_prevision',
        'total_income',
        'total_expense',
        'total_interest',
        'total_final',
        'account_id',
    ];

    protected $casts = [
        'date_prevision' => 'date',
        'total_income' => 'decimal:2',
        'total_expense' => 'decimal:2',
        'total_interest' => 'decimal:2',
        'total_final' => 'decimal:2',
    ];

    public function account()
    {
        return $this->belongsTo(Account::class);
    }
}
