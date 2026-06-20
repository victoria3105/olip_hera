<?php

namespace App\Http\Controllers;

use App\Contracts\AdminInterface;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    protected AdminInterface $adminService;

    public function __construct(AdminInterface $adminService)
    {
        $this->adminService = $adminService;
    }

    // USER

    public function users()
    {
        return response()->json([
            'data' => $this->adminService->getUsers()
        ]);
    }

    public function deleteUser($id)
    {
        $this->adminService->deleteUser($id);

        return response()->json([
            'message' => 'User berhasil dihapus'
        ]);
    }

    // PET

    public function pets()
    {
        return response()->json([
            'data' => $this->adminService->getPets()
        ]);
    }

    // SERVICE

    public function createService(Request $request)
    {
        return response()->json([
            'data' => $this->adminService->createService($request->all())
        ]);
    }

    public function updateService(Request $request, $id)
    {
        return response()->json([
            'data' => $this->adminService->updateService($id, $request->all())
        ]);
    }

    public function deleteService($id)
    {
        $this->adminService->deleteService($id);

        return response()->json([
            'message' => 'Service berhasil dihapus'
        ]);
    }

    // RESERVATION

    public function reservations()
    {
        return response()->json([
            'data' => $this->adminService->getReservations()
        ]);
    }

    public function updateReservationStatus(
        Request $request,
        $reservationId
    ) {
        return response()->json([
            'data' => $this->adminService
                ->updateReservationStatus(
                    $reservationId,
                    $request->status
                )
        ]);
    }
}