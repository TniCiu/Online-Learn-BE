<?php

use Illuminate\Support\Facades\Route;

// Route API v1
Route::prefix('v1')->group(function () {
    require base_path('routes/v1/userRoutes.php');
    require base_path('routes/v1/courseRoutes.php');
    require base_path('routes/v1/publicRoutes.php');
});

