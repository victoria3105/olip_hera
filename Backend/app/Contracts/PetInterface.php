<?php

namespace App\Contracts;

interface PetInterface
{
    public function getAllByUser(int $userId);

    public function findById(int $id);

    public function create(array $data);

    public function update(int $id, array $data);

    public function delete(int $id);
}