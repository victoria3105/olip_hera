<?php

namespace App\Services;

use App\Contracts\ReservationInterface;
use App\Models\Reservation;
use App\Models\ReservationHistory;

class ReservationService implements ReservationInterface
{
    public function getAllByUser(int $userId)
    {
        return Reservation::where('user_id', $userId)
            ->with(['pet', 'service'])
            ->get();
    }

    public function findById(int $id)
    {
        return Reservation::with(['pet', 'service', 'histories'])
            ->findOrFail($id);
    }

    public function create(array $data)
{
    $reservation = Reservation::create($data);

    ReservationHistory::create([
        'reservation_id' => $reservation->id,
        'status' => $reservation->status,
        'changed_by' => $reservation->user_id,
        'notes' => 'Reservasi dibuat'
    ]);

    return $reservation;
}

    public function update(int $id, array $data)
    {
        $reservation = Reservation::findOrFail($id);

        $reservation->update($data);

        return $reservation;
    }

    public function cancel(int $id)
{
    $reservation = Reservation::findOrFail($id);

    $reservation->update([
        'status' => 'Cancelled'
    ]);

    ReservationHistory::create([
        'reservation_id' => $reservation->id,
        'status' => 'Cancelled',
        'changed_by' => $reservation->user_id,
        'notes' => 'Reservasi dibatalkan'
    ]);

    return $reservation;
}

    public function getStatus(int $id)
    {
        return Reservation::findOrFail($id)->status;
    }
}