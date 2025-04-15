<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules()
{
    return [
        'firstName' => 'sometimes|required|string',
        'lastName' => 'sometimes|required|string',
        'phoneNumber' => 'nullable|string',
        'email' => 'sometimes|required|email|unique:users,email,' . $this->id,
        'bio' => 'nullable|string',
        'avatarUrl' => 'nullable|url',
        'password' => 'nullable|min:6',
    ];
}

}
