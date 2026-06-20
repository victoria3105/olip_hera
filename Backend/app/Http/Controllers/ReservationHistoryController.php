<?php

namespace App\Http\Controllers;

use App\Contracts\ReservationHistoryInterface;

class ReservationHistoryController extends Controller
{
    protected ReservationHistoryInterface $historyService;

    public function __construct(
        ReservationHistoryInterface $historyService
    ) {
        $this->historyService = $historyService;
    }

    public function userHistory($userId)
    {
        return response()->json([
            'data' => $this->historyService->getHistoryByUser($userId)
        ]);
    }

    public function reservationStatus($reservationId)
    {
        return response()->json([
            'data' => $this->historyService->getReservationStatus($reservationId)
        ]);
    }
}