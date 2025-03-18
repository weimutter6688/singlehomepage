import { ChangeEvent } from 'react';
import { Link } from '@/lib/data';

export type ToastType = 'success' | 'error' | 'info';
export type SortOption = 'alphabetical' | 'recent' | 'category';

export interface ToastState {
    visible: boolean;
    message: string;
    type: ToastType;
}

export interface LinkUpdateFunction {
    (prev: Link[]): Link[];
}

export interface CategoryUpdateFunction {
    (prev: string[]): string[];
}

export type SelectChangeHandler = (e: ChangeEvent<HTMLSelectElement>) => void;

export interface LinkListProps {
    className?: string;
}

export interface LinkCardProps {
    link: Link;
    onEdit: (link: Link) => void;
    onDelete: (id: string) => Promise<void>;
}