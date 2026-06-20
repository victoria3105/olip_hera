<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Contracts\AuthInterface;

class AuthController extends Controller
{
    protected AuthInterface $authService;

    public function __construct(AuthInterface $authService)
    {
        $this->authService = $authService;
    }

    public function register(Request $request)
    {
        $user = $this->authService->register($request->all());

        return response()->json([
            'message' => 'User berhasil didaftarkan',
            'data' => $user
        ], 201);
    }

    public function login(Request $request)
    {
        $user = $this->authService->login($request->only('email', 'password'));

        if (!$user) {
            return response()->json([
                'message' => 'Email atau password salah'
            ], 401);
        }

        return response()->json([
            'message' => 'Login berhasil',
            'data' => $user
        ]);
    }

    public function logout()
    {
        $this->authService->logout();

        return response()->json([
            'message' => 'Logout berhasil'
        ]);
    }

    public function profile($id)
    {
        $user = $this->authService->getProfile($id);

        return response()->json([
            'data' => $user
        ]);
    }
}