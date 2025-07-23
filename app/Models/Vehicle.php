<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Vehicle extends Model
{
    use SoftDeletes;

    protected $fillable = ['vehicle_name', 'model', 'company'];

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }
}
