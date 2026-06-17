<?php

namespace App\Services;

use App\Contracts\ReservationInterface;

class ReservationService implements ReservationInterface
{
    public function getAllByUser(int $userId)
    {
        return [];
    }

    public function findById(int $id)
    {
        return [];
    }

    public function create(array $data)
    {
        return [];
    }

    public function update(int $id, array $data)
    {
        return [];
    }

    public function cancel(int $id)
    {
        return true;
    }

    public function getStatus(int $id)
    {
        return 'pending';
    }
}