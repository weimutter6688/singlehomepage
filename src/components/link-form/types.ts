import { Link } from '@/lib/data';

export interface ErrorState {
    title?: string;
    url?: string;
    categories?: string;
}

export interface LinkFormProps {
    initialLink?: Link;
    categories: string[];
    onSubmit: (link: Omit<Link, 'id'> | Link) => void;
    onCancel: () => void;
}

export type ToastType = 'success' | 'error' | 'info';

export interface ToastState {
    visible: boolean;
    message: string;
    type: ToastType;
}

export interface UseFormReturn {
    title: string;
    url: string;
    description: string;
    isPrivate: boolean;
    selectedCategories: string[];
    newCategory: string;
    isSubmitting: boolean;
    errors: ErrorState;
    toast: ToastState;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    handleUrlBlur: () => void;
    handleCategoryToggle: (category: string) => void;
    handleAddNewCategory: () => void;
    setTitle: (value: string) => void;
    setUrl: (value: string) => void;
    setDescription: (value: string) => void;
    setIsPrivate: (value: boolean) => void;
    setNewCategory: (value: string) => void;
    updateErrors: (updates: Partial<ErrorState>) => void;
}

// URL validation regex - only checks for http:// or https:// prefix
export const URL_REGEX = /^https?:\/\//i;