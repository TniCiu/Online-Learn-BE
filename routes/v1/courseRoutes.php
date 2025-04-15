<?php
use App\Http\Controllers\CourseController;
use Illuminate\Support\Facades\Route;

// Route::prefix('/v1')->group(function () {
    // Định tuyến cho các API của Course
    Route::post('/instructor/courses', [CourseController::class, 'store']);       // Tạo khóa học
    Route::get('/instructor/courses', [CourseController::class, 'index']);        // Lấy tất cả khóa học
    Route::get('/instructor/courses/{id}', [CourseController::class, 'show']);     // Lấy khóa học theo ID
    Route::put('/instructor/courses/{id}', [CourseController::class, 'update']);   // Cập nhật khóa học
    Route::delete('/instructor/courses/{id}', [CourseController::class, 'destroy']); // Xóa khóa học
// });

?>