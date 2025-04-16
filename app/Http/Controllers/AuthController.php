<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;  // Thêm dòng này để sử dụng JWTAuth

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // Lấy thông tin email và password
        $credentials = $request->only('email', 'password');

        // Sử dụng JWTAuth để tạo token
        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Trả về token và thông tin người dùng
        return response()->json([
            'content' => [
                'accessToken' => $token,
                'user' => auth()->user(),
                'message' => 'Login successful',
                'status' => 200
            ]
        ]);
    }

    public function register(Request $request)
    {
        // Validate input
        $validator = Validator::make($request->all(), [
            'firstName' => 'required',
            'lastName' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Tạo người dùng mới
        $user = User::create([
            'firstName' => $request->firstName,
            'lastName' => $request->lastName,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Trả về người dùng và token (JWT)
        $token = JWTAuth::fromUser($user);  // Tạo token từ user đã tạo

        return response()->json([
            'user' => $user,
            'token' => $token
        ]);
    }
}