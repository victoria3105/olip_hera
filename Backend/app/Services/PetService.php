<?php

namespace App\Services;

use App\Contracts\PetInterface;
use App\Models\Pet;

class PetService implements PetInterface
{
    public function getAllByUser(int $userId)
    {
        return Pet::where('user_id', $userId)->get();
    }

    public function findById(int $id)
    {
        return Pet::findOrFail($id);
    }

    public function create(array $data)
    {
        return Pet::create($data);
    }

    public function update(int $id, array $data)
    {
        $pet = Pet::findOrFail($id);

        $pet->update($data);

        return $pet;
    }

    public function delete(int $id)
    {
        $pet = Pet::findOrFail($id);

        return $pet->delete();
    }
}