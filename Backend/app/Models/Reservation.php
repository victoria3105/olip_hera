<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[\Illuminate\Database\Eloquent\Attributes\Fillable(['user_id', 'pet_id', 'service_id', 'reservation_date', 'reservation_time', 'status', 'price', 'notes'])]
class Reservation extends Model
{
    use HasFactory;

    protected $casts = [
        'reservation_date' => 'date',
        'price' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function pet(): BelongsTo
    {
        return $this->belongsTo(Pet::class);
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function histories(): HasMany
    {
        return $this->hasMany(ReservationHistory::class);
    }
}
