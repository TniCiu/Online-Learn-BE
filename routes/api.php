<?php


use Illuminate\Support\Facades\Route;

// Route API v1
Route::prefix('v1')->group(function () {
    // Include các route cho v1
    require base_path('routes/api/v1/userRoutes.php');
});

// Route API v2
Route::prefix('v2')->group(function () {
});
