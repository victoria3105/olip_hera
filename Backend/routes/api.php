<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);
Route::get('/profile/{id}', [AuthController::class, 'profile']);

use App\Http\Controllers\PetController;

Route::get('/pets/user/{userId}', [PetController::class, 'index']);
Route::get('/pets/{id}', [PetController::class, 'show']);
Route::post('/pets', [PetController::class, 'store']);
Route::put('/pets/{id}', [PetController::class, 'update']);
Route::delete('/pets/{id}', [PetController::class, 'destroy']);

use App\Http\Controllers\ServiceController;

Route::get('/services', [ServiceController::class, 'index']);
Route::get('/services/{id}', [ServiceController::class, 'show']);
Route::post('/services', [ServiceController::class, 'store']);
Route::put('/services/{id}', [ServiceController::class, 'update']);
Route::delete('/services/{id}', [ServiceController::class, 'destroy']);

use App\Http\Controllers\ReservationController;

Route::get('/reservations/user/{userId}', [ReservationController::class, 'index']);
Route::get('/reservations/{id}', [ReservationController::class, 'show']);
Route::post('/reservations', [ReservationController::class, 'store']);
Route::put('/reservations/{id}', [ReservationController::class, 'update']);
Route::put('/reservations/{id}/cancel', [ReservationController::class, 'cancel']);
Route::get('/reservations/{id}/status', [ReservationController::class, 'status']);

use App\Http\Controllers\ReservationHistoryController;

Route::get(
    '/reservation-history/user/{userId}',
    [ReservationHistoryController::class, 'userHistory']
);

Route::get(
    '/reservation-history/reservation/{reservationId}',
    [ReservationHistoryController::class, 'reservationStatus']
);

use App\Http\Controllers\AdminController;

// USER
Route::get('/admin/users', [AdminController::class, 'users']);
Route::delete('/admin/users/{id}', [AdminController::class, 'deleteUser']);

// PET
Route::get('/admin/pets', [AdminController::class, 'pets']);

// SERVICE
Route::post('/admin/services', [AdminController::class, 'createService']);
Route::put('/admin/services/{id}', [AdminController::class, 'updateService']);
Route::delete('/admin/services/{id}', [AdminController::class, 'deleteService']);

// RESERVATION
Route::get('/admin/reservations', [AdminController::class, 'reservations']);
Route::put(
    '/admin/reservations/{reservationId}/status',
    [AdminController::class, 'updateReservationStatus']
);