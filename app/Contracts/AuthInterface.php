<?php

namespace App\Contracts;

interface AuthInterface
{
    public function register(array $data);

    public function login(array $credentials);

    public function logout();

    public function getProfile(int $userId);
}