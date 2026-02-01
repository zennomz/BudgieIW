<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Income extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'recurring',
        'value_recurring',
        'amount',
        'date_start',
        'date_end',
        'account_id',
    ];

    protected $casts = [
        'recurring' => 'boolean',
        'amount' => 'decimal:2',
        'date_start' => 'date',
        'date_end' => 'date',
    ];

    public function account()
    {
        return $this->belongsTo(Account::class);
    }
}
