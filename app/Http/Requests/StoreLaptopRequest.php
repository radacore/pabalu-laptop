<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLaptopRequest extends FormRequest
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
            'brand_id' => 'required|exists:brands,id',
            'laptop_source_id' => 'required|exists:laptop_sources,id',
            'model_name' => 'required|string|max:255',
            'serial_number' => 'nullable|string|max:255|unique:laptops',
            'condition' => 'required|in:new,used,refurbished,for_parts',
            'status' => 'required|in:available,sold',
            'purchase_price' => 'nullable|numeric|min:0',
            'selling_price' => 'nullable|numeric|min:0',
            'purchase_date' => 'nullable|date',
            'notes' => 'nullable|string',
            'photos' => 'nullable|array',
            'photos.*' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'processor' => 'nullable|string|max:255',
            'ram' => 'nullable|string|max:255',
            'storage' => 'nullable|string|max:255',
            'gpu' => 'nullable|string|max:255',
            'display' => 'nullable|string|max:255',
            'battery' => 'nullable|string|max:255',
            'os' => 'nullable|string|max:255',
            'color' => 'nullable|string|max:255',
            'year' => 'nullable|string|max:255',
        ];
    }
}
