import React, { useEffect, useState } from 'react';
import {
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
    CButton,
    CForm,
    CFormInput,
} from '@coreui/react';
import { router } from '@inertiajs/react';

export default function BankModal({ visible, onClose, mode = 'add', bank = {} }) {
    const [bankName, setBankName] = useState('');
    const [balance, setBalance] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (mode === 'edit' && bank) {
            setBankName(bank.bank_name || '');
            setBalance(bank.balance ? Number(bank.balance).toLocaleString() : '');
        } else {
            setBankName('');
            setBalance('');
        }
        setErrors({});
    }, [visible, mode, bank]);

    const handleBalanceChange = (e) => {
        const rawValue = e.target.value.replace(/,/g, '');
        if (!isNaN(rawValue)) {
            const formatted = Number(rawValue).toLocaleString();
            setBalance(formatted);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const cleanedBalance = balance.replace(/,/g, '');

        const url = mode === 'edit' ? `/update-bank/${bank.id}` : '/store-bank';
        const method = mode === 'edit' ? 'put' : 'post';

        router[method](url, {
            bank_name: bankName,
            balance: cleanedBalance,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                onClose();
                setBankName('');
                setBalance('');
                setErrors({});
            },
            onError: (err) => {
                setErrors(err);
            }
        });
    };

    return (
        <CModal visible={visible} onClose={onClose} backdrop="static">
            <CModalHeader onClose={onClose}>
                <CModalTitle>{mode === 'edit' ? 'Edit Bank' : 'Add New Bank'}</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CForm onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <CFormInput
                            type="text"
                            placeholder="Bank Name"
                            value={bankName}
                            onChange={(e) => setBankName(e.target.value)}
                            invalid={!!errors.bank_name}
                        />
                        {errors.bank_name && <div className="text-danger mt-1">{errors.bank_name}</div>}
                    </div>

                    <div className="mb-3">
                        <CFormInput
                            type="text"
                            placeholder="Balance"
                            value={balance}
                            onChange={handleBalanceChange}
                            invalid={!!errors.balance}
                        />
                        {errors.balance && <div className="text-danger mt-1">{errors.balance}</div>}
                    </div>

                    <CModalFooter>
                        <CButton color="secondary" onClick={onClose}>Cancel</CButton>
                        <CButton type="submit" color="primary">{mode === 'edit' ? 'Update' : 'Save'}</CButton>
                    </CModalFooter>
                </CForm>
            </CModalBody>
        </CModal>
    );
}
