<?php

namespace App\Contracts;

interface ReservationInterface
{
    public function getAllByUser(int $userId);

    public function findById(int $id);

    public function create(array $data);

    public function update(int $id, array $data);

    public function cancel(int $id);

    public function getStatus(int $id);
}