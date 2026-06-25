<?php

namespace App\Http\Controllers;

use App\Models\Pet;
use App\Models\Service;
use App\Models\Reservation;
use App\Models\User;

class DashboardController extends Controller
{
    public function index()
    {
        return response()->json([
            'status' => 'success',
            'data' => [
                'totalPets' => Pet::count(),
                'totalServices' => Service::count(),
                'totalReservations' => Reservation::count(),
                'totalUsers' => User::count(),
            ]
        ]);
    }
}
