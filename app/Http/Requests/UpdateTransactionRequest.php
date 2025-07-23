<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTransactionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'data.total_amount' => ['required', 'numeric'],
            'data.transaction_type' => ['required', 'in:credit,debit'],

            'data.customer_name' => ['required', 'string'],
            'data.cnic' => ['required', 'regex:/^[0-9]{5}-[0-9]{7}-[0-9]{1}$/'],
            'data.phone_no' => ['required', 'string'],

            'data.vehicle_name' => ['nullable', 'string'],
            'data.model' => ['nullable', 'string'],
            'data.company' => ['nullable', 'string']
        ];
    }

    public function messages(): array
    {
        return [
            'data.total_amount.required' => 'Total amount is required.',
            'data.transaction_type.required' => 'Transaction type is required.',
            'data.customer_name.required' => 'Customer name is required.',
            'data.cnic.required' => 'CNIC is required.',
            'data.cnic.regex' => 'The format is invalid',
            'data.phone_no.required' => 'Phone number is required.',
        ];
    }
}
