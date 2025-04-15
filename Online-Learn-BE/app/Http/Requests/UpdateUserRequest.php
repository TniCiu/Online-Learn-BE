<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Cho phép request được xử lý
    }

    public function rules(): array
    {
        return [
            'firstName' => 'sometimes|string|max:255',
            'lastName' => 'sometimes|string|max:255',
            'phoneNumber' => 'sometimes|string|max:20',
            'email' => 'sometimes|email|unique:users,email,' . $this->route('id'),
            'bio' => 'nullable|string',
            'avatarUrl' => 'nullable|url',
            'password' => 'nullable|string|min:6',
        ];
    }

    public function messages(): array
    {
        return [
            'firstName.string' => 'First name phải là chuỗi.',
            'lastName.string' => 'Last name phải là chuỗi.',
            'phoneNumber.string' => 'Số điện thoại phải là chuỗi.',
            'email.email' => 'Email không hợp lệ.',
            'email.unique' => 'Email đã tồn tại.',
            'avatarUrl.url' => 'Avatar phải là một URL hợp lệ.',
            'password.min' => 'Mật khẩu phải có ít nhất 6 ký tự.',
        ];
    }
}
