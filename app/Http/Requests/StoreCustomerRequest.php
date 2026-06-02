<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCustomerRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'phone' => [
                'required',
                'string',
                'max:20',
                'unique:customers',
                'unique:users,phone',
            ],
            'address' => 'nullable|string',
            'note' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'phone.unique' => __('phone_number_taken'),
        ];
    }
}
