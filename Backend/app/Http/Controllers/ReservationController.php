<?php

namespace App\Http\Controllers;

use App\Contracts\ReservationInterface;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    protected ReservationInterface $reservationService;

    public function __construct(ReservationInterface $reservationService)
    {
        $this->reservationService = $reservationService;
    }

    public function index($userId)
    {
        return response()->json([
            'data' => $this->reservationService->getAllByUser($userId)
        ]);
    }

    public function show($id)
    {
        return response()->json([
            'data' => $this->reservationService->findById($id)
        ]);
    }

    public function store(Request $request)
    {
        $reservation = $this->reservationService->create($request->all());

        return response()->json([
            'message' => 'Reservasi berhasil dibuat',
            'data' => $reservation
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $reservation = $this->reservationService->update($id, $request->all());

        return response()->json([
            'message' => 'Reservasi berhasil diperbarui',
            'data' => $reservation
        ]);
    }

    public function cancel($id)
    {
        $reservation = $this->reservationService->cancel($id);

        return response()->json([
            'message' => 'Reservasi berhasil dibatalkan',
            'data' => $reservation
        ]);
    }

    public function status($id)
    {
        return response()->json([
            'status' => $this->reservationService->getStatus($id)
        ]);
    }
}