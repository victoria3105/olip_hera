<?php

namespace App\Services;

use App\Contracts\ReservationHistoryInterface;

class ReservationHistoryService implements ReservationHistoryInterface
{
    public function getHistoryByUser(int $userId)
    {
        return [];
    }

    public function getReservationStatus(int $reservationId)
    {
        return 'pending';
    }
}