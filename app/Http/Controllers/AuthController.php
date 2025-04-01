<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    
    // Đăng ký
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email|unique:users',
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'phoneNumber' => 'required|string|max:15',
            'bio' => 'nullable|string',
            'avatarUrl' => 'nullable|string|url',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'email' => $request->email,
            'firstName' => $request->firstName,
            'lastName' => $request->lastName,
            'phoneNumber' => $request->phoneNumber,
            'bio' => $request->bio,
            'avatarUrl' => $request->avatarUrl,
            'password' => Hash::make($request->password),
        ]);

        $accessToken = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Đăng ký thành công!',
            'user' => $user,
            'accessToken' => $accessToken,
        ], 201);
    }

    // Đăng nhập
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Sai tài khoản hoặc mật khẩu'], 401);
        }

        $user = Auth::user();
        $accessToken = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Đăng nhập thành công!',
            'user' => $user,
            'accessToken' => $accessToken,
        ], 200);
    }

     // API Lấy danh sách người dùng
     public function getUsers()
     {
         $users = User::all(); // Lấy tất cả người dùng
         return response()->json(['users' => $users], 200);
     }
 
     // API Lấy thông tin người dùng cụ thể
     public function getUser($id)
     {
         $user = User::find($id);
 
         if (!$user) {
             return response()->json(['message' => 'Người dùng không tồn tại'], 404);
         }
 
         return response()->json(['user' => $user], 200);
     }
 
     // API Cập nhật thông tin người dùng
     public function updateProfile(Request $request)
     {
         $validator = Validator::make($request->all(), [
             'firstName' => 'required|string|max:255',
             'lastName' => 'required|string|max:255',
             'phoneNumber' => 'required|string|max:15',
             'bio' => 'nullable|string',
             'avatarUrl' => 'nullable|string|url',
         ]);
 
         if ($validator->fails()) {
             return response()->json(['errors' => $validator->errors()], 422);
         }
 
         $user = $request->user();
 
         $user->firstName = $request->firstName;
         $user->lastName = $request->lastName;
         $user->phoneNumber = $request->phoneNumber;
         $user->bio = $request->bio;
         $user->avatarUrl = $request->avatarUrl;
 
         $user->save();
 
         return response()->json(['message' => 'Cập nhật thông tin thành công!', 'user' => $user], 200);
     }
 
     // API Xóa người dùng
     public function deleteUser($id)
     {
         $user = User::find($id);
 
         if (!$user) {
             return response()->json(['message' => 'Người dùng không tồn tại'], 404);
         }
 
         $user->delete();
 
         return response()->json(['message' => 'Xóa người dùng thành công!'], 200);
     }
 
    // Lấy thông tin người dùng hiện tại
    public function userProfile(Request $request)
    {
        return response()->json(['user' => $request->user()], 200);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Đăng xuất thành công'], 200);
    }
}
