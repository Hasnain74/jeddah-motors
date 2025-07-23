<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Customer extends Model
{
    use SoftDeletes;

    protected $fillable = ['customer_name', 'cnic', 'phone_no'];

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }
}
