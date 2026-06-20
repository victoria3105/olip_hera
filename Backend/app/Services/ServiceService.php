<?php

namespace App\Services;

use App\Contracts\ServiceInterface;
use App\Models\Service;

class ServiceService implements ServiceInterface
{
    public function getAll()
    {
        return Service::all();
    }

    public function findById(int $id)
    {
        return Service::findOrFail($id);
    }

    public function create(array $data)
    {
        return Service::create($data);
    }

    public function update(int $id, array $data)
    {
        $service = Service::findOrFail($id);

        $service->update($data);

        return $service;
    }

    public function delete(int $id)
    {
        $service = Service::findOrFail($id);

        return $service->delete();
    }
}