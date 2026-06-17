<?php

namespace App\Contracts;

interface ReservationHistoryInterface
{
    public function getHistoryByUser(int $userId);

    public function getReservationStatus(int $reservationId);
}