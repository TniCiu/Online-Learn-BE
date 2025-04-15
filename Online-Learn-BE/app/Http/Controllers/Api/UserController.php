<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Services\UserService;
use Illuminate\Http\Request;

class UserController extends Controller
{
    protected $service;

    public function __construct(UserService $service)
    {
        $this->middleware('auth:api')->except('index'); 
        $this->service = $service;
    }

    public function index()
    {
        return response()->json($this->service->getAll());
    }

    public function store(StoreUserRequest $request)
    {
        return response()->json($this->service->create($request->validated()));
    }

    public function show($id)
    {
        return response()->json($this->service->find($id));
    }

    public function update(UpdateUserRequest $request, $id)
    {
        return response()->json($this->service->update($id, $request->validated()));
    }

    public function destroy($id)
    {
        $this->service->delete($id);
        return response()->json(['message' => 'User deleted']);
    }
}
