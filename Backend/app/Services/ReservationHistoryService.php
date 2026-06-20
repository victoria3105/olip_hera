<?php

namespace App\Services;

use App\Contracts\ReservationHistoryInterface;
use App\Models\ReservationHistory;

class ReservationHistoryService implements ReservationHistoryInterface
{
    public function getHistoryByUser(int $userId)
    {
        return ReservationHistory::whereHas('reservation', function ($query) use ($userId) {
            $query->where('user_id', $userId);
        })->with('reservation')->get();
    }

    public function getReservationStatus(int $reservationId)
    {
        return ReservationHistory::where('reservation_id', $reservationId)
            ->latest()
            ->first();
    }
}