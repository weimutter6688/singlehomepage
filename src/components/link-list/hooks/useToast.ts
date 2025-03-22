import { useState } from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastState {
    visible: boolean;
    message: string;
    type: ToastType;
}

export const useToast = () => {
    const [toast, setToast] = useState<ToastState>({
        visible: false,
        message: '',
        type: 'info'
    });

    const showToast = (message: string, type: ToastType = 'info') => {
        setToast({
            visible: true,
            message,
            type
        });

        // Auto hide after 3 seconds
        setTimeout(() => {
            setToast((prev) => ({ ...prev, visible: false }));
        }, 3000);
    };

    return {
        toast,
        showToast
    };
};