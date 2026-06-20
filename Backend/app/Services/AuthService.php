<?php

namespace App\Services;

use App\Contracts\AuthInterface;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class AuthService implements AuthInterface
{
    public function register(array $data)
    {
        return User::create($data);
    }

    public function login(array $credentials)
    {
        if (!Auth::attempt($credentials)) {
            return null;
        }

        return Auth::user();
    }

    public function logout()
    {
        Auth::logout();

        return true;
    }

    public function getProfile(int $userId)
    {
        return User::findOrFail($userId);
    }
}