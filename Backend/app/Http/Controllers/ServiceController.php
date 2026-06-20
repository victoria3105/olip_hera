<?php

namespace App\Http\Controllers;

use App\Contracts\ServiceInterface;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    protected ServiceInterface $service;

    public function __construct(ServiceInterface $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        return response()->json([
            'data' => $this->service->getAll()
        ]);
    }

    public function show($id)
    {
        return response()->json([
            'data' => $this->service->findById($id)
        ]);
    }

    public function store(Request $request)
    {
        $service = $this->service->create($request->all());

        return response()->json([
            'message' => 'Service berhasil ditambahkan',
            'data' => $service
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $service = $this->service->update($id, $request->all());

        return response()->json([
            'message' => 'Service berhasil diperbarui',
            'data' => $service
        ]);
    }

    public function destroy($id)
    {
        $this->service->delete($id);

        return response()->json([
            'message' => 'Service berhasil dihapus'
        ]);
    }
}