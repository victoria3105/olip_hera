<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

// Contracts
use App\Contracts\AuthInterface;
use App\Contracts\PetInterface;
use App\Contracts\AdminInterface;
use App\Contracts\ServiceInterface;
use App\Contracts\ReservationInterface;
use App\Contracts\ReservationHistoryInterface;

// Services
use App\Services\AuthService;
use App\Services\PetService;
use App\Services\AdminService;
use App\Services\ServiceService;
use App\Services\ReservationService;
use App\Services\ReservationHistoryService;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(AuthInterface::class, AuthService::class);
        $this->app->bind(PetInterface::class, PetService::class);
        $this->app->bind(AdminInterface::class, AdminService::class);
        $this->app->bind(ServiceInterface::class, ServiceService::class);
        $this->app->bind(ReservationInterface::class, ReservationService::class);
        $this->app->bind(
            ReservationHistoryInterface::class,
            ReservationHistoryService::class
        );
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}