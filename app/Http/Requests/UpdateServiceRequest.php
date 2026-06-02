<?php

namespace App\Http\Requests;

use App\Services\ServiceService;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateServiceRequest extends FormRequest
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
            'customer_id' => 'sometimes|required|exists:customers,id',
            'laptop_id' => 'nullable|exists:laptops,id',
            'service_category_id' => 'sometimes|required|exists:service_categories,id',
            'laptop_model' => 'nullable|string|max:255',
            'laptop_serial' => 'nullable|string|max:255',
            'issue_description' => 'sometimes|required|string',
            'diagnosis' => 'nullable|string',
            'status' => ['sometimes', Rule::in(ServiceService::STATUSES)],
            'estimated_cost' => 'nullable|numeric|min:0',
            'final_cost' => 'nullable|numeric|min:0',
            'down_payment' => 'nullable|numeric|min:0',
            'pickup_date' => 'nullable|date',
            'completion_date' => 'nullable|date',
            'notes' => 'nullable|string',
            'parts' => 'nullable|array',
            'parts.*.part_name' => 'required_with:parts|string|max:255',
            'parts.*.quantity' => 'required_with:parts|integer|min:1',
            'parts.*.unit_price' => 'required_with:parts|numeric|min:0',
            'photo_path' => 'nullable|string',
        ];
    }
}
