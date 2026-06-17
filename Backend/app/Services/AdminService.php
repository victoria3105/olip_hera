<?php

namespace App\Services;

use App\Contracts\AdminInterface;

class AdminService implements AdminInterface
{
    // User Management
    public function getUsers()
    {
        return [];
    }

    public function deleteUser(int $id)
    {
        return true;
    }

    // Pet Management
    public function getPets()
    {
        return [];
    }

    // Service Management
    public function createService(array $data)
    {
        return [];
    }

    public function updateService(int $id, array $data)
    {
        return [];
    }

    public function deleteService(int $id)
    {
        return true;
    }

    // Reservation Management
    public function getReservations()
    {
        return [];
    }

    public function updateReservationStatus(
        int $reservationId,
        string $status
    ) {
        return true;
    }
}