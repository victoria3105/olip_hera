<?php

namespace App\Services;

use App\Contracts\AdminInterface;
use App\Models\User;
use App\Models\Pet;
use App\Models\Service;
use App\Models\Reservation;

class AdminService implements AdminInterface
{
    // =========================
    // USER
    // =========================

    public function getUsers()
    {
        return User::all();
    }

    public function deleteUser(int $id)
    {
        return User::destroy($id);
    }

    // =========================
    // PET
    // =========================

    public function getPets()
    {
        return Pet::with('user')->get();
    }

    // =========================
    // SERVICE
    // =========================

    public function createService(array $data)
    {
        return Service::create($data);
    }

    public function updateService(int $id, array $data)
    {
        $service = Service::findOrFail($id);

        $service->update($data);

        return $service;
    }

    public function deleteService(int $id)
    {
        return Service::destroy($id);
    }

    // =========================
    // RESERVATION
    // =========================

    public function getReservations()
    {
        return Reservation::with(['user', 'pet', 'service'])->get();
    }

    public function updateReservationStatus(
        int $reservationId,
        string $status
    ) {
        $reservation = Reservation::findOrFail($reservationId);

        $reservation->update([
            'status' => $status,
        ]);

        return $reservation;
    }
}