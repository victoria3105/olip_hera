<?php

namespace App\Services;

use App\Contracts\PetInterface;

class PetService implements PetInterface
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

    public function delete(int $id)
    {
        return true;
    }
}