<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

// Đăng ký và Đăng nhập
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Group các route yêu cầu đăng nhập
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'userProfile']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
    Route::get('/users', [AuthController::class, 'getUsers']); // Lấy danh sách người dùng
    Route::get('/user/{id}', [AuthController::class, 'getUser']); // Lấy thông tin người dùng theo id
    Route::put('/user/update', [AuthController::class, 'updateProfile']); // Cập nhật thông tin người dùng
    Route::delete('/user/{id}', [AuthController::class, 'deleteUser']); // Xóa người dùng
});
