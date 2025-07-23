<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreTransactionRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'isNewCustomer' => ['required', 'boolean'],
            'transaction_type' => ['required', 'in:credit,debit'],
            'total_amount' => ['required', 'numeric'],
            'paid_amount' => ['required', 'numeric'],
            'paid_on' => ['required', 'date'],
            'transfer_type' => ['required', 'in:cash,cheque,online_transfer'],

            'vehicle_name' => ['nullable', 'string'],
            'company' => ['nullable', 'string'],
            'model' => ['nullable', 'string'],

            // Basic field type validations
            'customer_id' => ['nullable', 'integer', 'exists:customers,id'],
            'customer_name' => ['nullable', 'string', 'max:255'],
            'cnic' => ['nullable', 'string', 'regex:/^\d{5}-\d{7}-\d{1}$/'],
            'phone_no' => ['nullable', 'string', 'max:20'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $isNewCustomer = $this->boolean('isNewCustomer');

            // Validate new customer fields
            if ($isNewCustomer) {
                if (empty($this->input('customer_name'))) {
                    $validator->errors()->add('customer_name', 'Customer name is required for new customers');
                }

                if (empty($this->input('cnic'))) {
                    $validator->errors()->add('cnic', 'CNIC is required for new customers');
                } elseif (!preg_match('/^[0-9]{5}-[0-9]{7}-[0-9]{1}$/', $this->input('cnic'))) {
                    $validator->errors()->add('cnic', 'CNIC must be in the format: 12345-1234567-1');
                }

                if (empty($this->input('phone_no'))) {
                    $validator->errors()->add('phone_no', 'Phone number is required for new customers');
                }
            }
            // Validate existing customer field
            else {
                if (empty($this->input('customer_id'))) {
                    $validator->errors()->add('customer_id', 'Please select an existing customer');
                }
            }
        });
    }

    public function authorize(): bool
    {
        return true;
    }
}
