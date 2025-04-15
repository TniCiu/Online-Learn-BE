<?php
use App\Http\Controllers\PublicController;
use Illuminate\Support\Facades\Route;

Route::post('/public/upload', [PublicController::class, 'uploadFile']);

?>