<?php

namespace App\Services;

use App\Contracts\ServiceInterface;

class ServiceService implements ServiceInterface
{
    public function getAll()
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