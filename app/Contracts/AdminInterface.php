<?php

namespace App\Contracts;

interface AdminInterface
{
    // User Management
    public function getUsers();

    public function deleteUser(int $id);

    // Pet Management
    public function getPets();

    // Service Management
    public function createService(array $data);

    public function updateService(int $id, array $data);

    public function deleteService(int $id);

    // Reservation Management
    public function getReservations();

    public function updateReservationStatus(
        int $reservationId,
        string $status
    );
}