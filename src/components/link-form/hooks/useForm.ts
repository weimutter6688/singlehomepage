import { useState, useEffect } from 'react';
import { ErrorState, LinkFormProps, ToastState, UseFormReturn, URL_REGEX } from '../types';

export function useForm({ initialLink, onSubmit }: Pick<LinkFormProps, 'initialLink' | 'onSubmit'>): UseFormReturn {
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [description, setDescription] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [newCategory, setNewCategory] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<ErrorState>({});
    const [toast, setToast] = useState<ToastState>({
        visible: false,
        message: '',
        type: 'info'
    });

    // Initialize form with link data if editing
    useEffect(() => {
        if (initialLink) {
            setTitle(initialLink.title);
            setUrl(initialLink.url);
            setDescription(initialLink.description || '');
            setSelectedCategories(initialLink.categories || []);
        }
    }, [initialLink]);

    // Hide toast after 3 seconds
    useEffect(() => {
        if (toast.visible) {
            const timer = setTimeout(() => {
                updateToast({ visible: false });
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [toast.visible]);

    const updateErrors = (updates: Partial<ErrorState>) => {
        setErrors((prev: ErrorState) => ({ ...prev, ...updates }));
    };

    const updateToast = (updates: Partial<ToastState>) => {
        setToast((prev: ToastState) => ({ ...prev, ...updates }));
    };

    const showToast = (message: string, type: ToastState['type'] = 'info') => {
        updateToast({
            visible: true,
            message,
            type
        });
    };

    const validateForm = (): boolean => {
        const newErrors: ErrorState = {};

        if (!title.trim()) {
            newErrors.title = '请输入标题';
        }

        if (!url.trim()) {
            newErrors.url = '请输入URL';
        } else {
            const urlWithProtocol = url.trim();
            if (!urlWithProtocol.startsWith('http://') && !urlWithProtocol.startsWith('https://')) {
                newErrors.url = '请输入以 http:// 或 https:// 开头的有效URL';
            } else if (!URL_REGEX.test(urlWithProtocol)) {
                newErrors.url = '请输入有效的URL';
            }
        }

        if (selectedCategories.length === 0 && !newCategory.trim()) {
            newErrors.categories = '请至少选择一个分类';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Add new category if entered
            const categories = [...selectedCategories];
            if (newCategory.trim() && !categories.includes(newCategory.trim())) {
                categories.push(newCategory.trim());
            }

            const linkData = {
                ...(initialLink && { id: initialLink.id }),
                title: title.trim(),
                url: url.trim(),
                description: description.trim() || undefined,
                categories: categories.length > 0 ? categories : []
            };

            await onSubmit(linkData);
            showToast(initialLink ? '链接已成功更新' : '链接已成功添加', 'success');
        } catch (error) {
            console.error('Form submission error:', error);
            showToast('提交表单时出错，请重试', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUrlBlur = () => {
        const urlWithProtocol = url.trim();
        if (urlWithProtocol) {
            if (!urlWithProtocol.startsWith('http://') && !urlWithProtocol.startsWith('https://')) {
                updateErrors({ url: '请输入以 http:// 或 https:// 开头的有效URL' });
            } else if (!URL_REGEX.test(urlWithProtocol)) {
                updateErrors({ url: '请输入有效的URL' });
            } else {
                updateErrors({ url: undefined });
            }
        }
    };

    const handleCategoryToggle = (category: string) => {
        setSelectedCategories((prev: string[]) =>
            prev.includes(category)
                ? prev.filter((c: string) => c !== category)
                : [...prev, category]
        );

        if (errors.categories) {
            updateErrors({ categories: undefined });
        }
    };

    const handleAddNewCategory = () => {
        const trimmedCategory = newCategory.trim();
        if (trimmedCategory && !selectedCategories.includes(trimmedCategory)) {
            setSelectedCategories((prev: string[]) => [...prev, trimmedCategory]);
            setNewCategory('');

            if (errors.categories) {
                updateErrors({ categories: undefined });
            }
        }
    };

    return {
        title,
        url,
        description,
        selectedCategories,
        newCategory,
        isSubmitting,
        errors,
        toast,
        handleSubmit,
        handleUrlBlur,
        handleCategoryToggle,
        handleAddNewCategory,
        setTitle,
        setUrl,
        setDescription,
        setNewCategory,
        updateErrors,
    };
}