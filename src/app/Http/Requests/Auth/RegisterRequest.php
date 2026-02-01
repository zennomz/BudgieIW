<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {

        return [
            'email' => ['required','email','max:60','unique:users,email'],
            'password' => ['required','min:8','confirmed'],
            'firstname' => ['nullable','string','max:50'],
            'lastname' => ['nullable','string','max:50'],
            'date_of_birth' => ['nullable','date'],
            'numero_phone' => ['nullable','string','max:20'],
        ];
    }
}
