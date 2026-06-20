<?php

namespace App\Http\Controllers;

use App\Contracts\PetInterface;
use Illuminate\Http\Request;

class PetController extends Controller
{
    protected PetInterface $petService;

    public function __construct(PetInterface $petService)
    {
        $this->petService = $petService;
    }

    public function index($userId)
    {
        return response()->json([
            'data' => $this->petService->getAllByUser($userId)
        ]);
    }

    public function show($id)
    {
        return response()->json([
            'data' => $this->petService->findById($id)
        ]);
    }

    public function store(Request $request)
    {
        $pet = $this->petService->create($request->all());

        return response()->json([
            'message' => 'Pet berhasil ditambahkan',
            'data' => $pet
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $pet = $this->petService->update($id, $request->all());

        return response()->json([
            'message' => 'Pet berhasil diperbarui',
            'data' => $pet
        ]);
    }

    public function destroy($id)
    {
        $this->petService->delete($id);

        return response()->json([
            'message' => 'Pet berhasil dihapus'
        ]);
    }
}