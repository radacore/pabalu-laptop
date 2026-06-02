import { useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { LucideImagePlus, LucideTrash2, LucideStar, LucideAlertCircle } from 'lucide-react';

interface ExistingPhoto {
    id: number;
    photo_path: string;
    is_primary: boolean;
}

interface PhotoUploadProps {
    existingPhotos?: ExistingPhoto[];
    onFilesChange: (files: File[]) => void;
    onDeleteExisting: (photoId: number) => void;
    errors?: string | string[];
}

export function PhotoUpload({ existingPhotos = [], onFilesChange, onDeleteExisting, errors }: PhotoUploadProps) {
    const { t } = useTranslation();
    const inputRef = useRef<HTMLInputElement>(null);
    const [pendingFiles, setPendingFiles] = useState<File[]>([]);
    const [pendingPreviews, setPendingPreviews] = useState<string[]>([]);

    const handleSelect = () => {
        inputRef.current?.click();
    };

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const merged = [...pendingFiles, ...files];
        setPendingFiles(merged);
        onFilesChange(merged);

        const urls = files.map((f) => URL.createObjectURL(f));
        setPendingPreviews((prev) => [...prev, ...urls]);

        e.target.value = '';
    }, [pendingFiles, onFilesChange]);

    const removePending = useCallback((index: number) => {
        URL.revokeObjectURL(pendingPreviews[index]);
        const updatedFiles = pendingFiles.filter((_, i) => i !== index);
        const updatedPreviews = pendingPreviews.filter((_, i) => i !== index);
        setPendingFiles(updatedFiles);
        setPendingPreviews(updatedPreviews);
        onFilesChange(updatedFiles);
    }, [pendingFiles, pendingPreviews, onFilesChange]);

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap gap-3">
                {existingPhotos.map((photo) => {
                    const url = `/storage/${photo.photo_path}`;
                    return (
                        <div key={photo.id} className="group relative size-28 overflow-hidden rounded-lg border">
                            <img src={url} alt="" className="size-full object-cover" />
                            {photo.is_primary && (
                                <span className="absolute left-1 top-1 flex size-5 items-center justify-center rounded-full bg-amber-400 text-white">
                                    <LucideStar className="size-3" />
                                </span>
                            )}
                            <button
                                type="button"
                                onClick={() => onDeleteExisting(photo.id)}
                                className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-red-500/80 text-white opacity-0 transition-opacity group-hover:opacity-100"
                            >
                                <LucideTrash2 className="size-3" />
                            </button>
                        </div>
                    );
                })}

                {pendingPreviews.map((url, i) => (
                    <div key={url} className="group relative size-28 overflow-hidden rounded-lg border">
                        <img src={url} alt="" className="size-full object-cover" />
                        <button
                            type="button"
                            onClick={() => removePending(i)}
                            className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-red-500/80 text-white opacity-0 transition-opacity group-hover:opacity-100"
                        >
                            <LucideTrash2 className="size-3" />
                        </button>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={handleSelect}
                    className="flex size-28 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-gray-400 transition-colors hover:border-gray-400 hover:text-gray-500"
                >
                    <LucideImagePlus className="size-8" />
                </button>
            </div>

            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                multiple
                onChange={handleFileChange}
                className="sr-only"
            />

            {errors && (
                <p className="flex items-center gap-1 text-sm text-red-500">
                    <LucideAlertCircle className="size-4" />
                    {Array.isArray(errors) ? errors.join(', ') : errors}
                </p>
            )}

            <p className="text-xs text-gray-400">
                {t('laptops.photos_hint', { defaultValue: 'JPEG, PNG, GIF, or WebP. Max 5MB each. Auto-compressed to WebP.' })}
            </p>
        </div>
    );
}
