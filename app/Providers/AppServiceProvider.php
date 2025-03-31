<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Kiểm tra và đăng ký route cho API nếu cần thiết
        Route::prefix('api')
            ->middleware('api')
            ->namespace('App\\Http\\Controllers') // Đảm bảo namespace là chính xác
            ->group(base_path('routes/api.php')); // Đảm bảo API route được tải từ đúng file
    }
}

