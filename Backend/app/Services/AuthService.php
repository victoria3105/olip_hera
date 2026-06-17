<?php

namespace App\Services;

use App\Contracts\AuthInterface;

class AuthService implements AuthInterface
{
    public function register(array $data)
    {
        // Logic register user
    }

    public function login(array $credentials)
    {
        // Logic login user
    }

    public function logout()
    {
        // Logic logout user
    }

    public function getProfile(int $userId)
    {
        // Logic mengambil profil user
    }
}