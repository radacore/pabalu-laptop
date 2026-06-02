import { useTranslation } from 'react-i18next';
import { FieldInput } from '@/components/form/field-input';
import { FieldSelect } from '@/components/form/field-select';
import { FieldTextarea } from '@/components/form/field-textarea';
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Link, useForm } from '@inertiajs/react';
import { LucideCircleX, LucideSave } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useConfirmDialogStore } from '@/stores/confirm-dialog-store';
import { PhotoUpload } from './photo-upload';
import type { Laptop, LaptopOption } from './types';

interface LaptopFormProps {
    brands: LaptopOption[];
    laptopSources: LaptopOption[];
    laptop?: Laptop;
    mode?: 'create' | 'edit';
}

export function LaptopForm({ brands, laptopSources, laptop, mode = 'create' }: LaptopFormProps) {
    const { t } = useTranslation();
    const isEditMode = mode === 'edit';
    const { show } = useConfirmDialogStore();
    const existingPhotos = laptop?.photos || [];

    const form = useForm({
        brand_id: laptop?.brand_id ? String(laptop.brand_id) : '',
        laptop_source_id: laptop?.laptop_source_id ? String(laptop.laptop_source_id) : '',
        model_name: laptop?.model_name || '',
        serial_number: laptop?.serial_number || '',
        condition: laptop?.condition || 'used',
        status: laptop?.status || 'available',
        purchase_price: laptop?.purchase_price || '',
        selling_price: laptop?.selling_price || '',
        purchase_date: formatDateForInput(laptop?.purchase_date),
        notes: laptop?.notes || '',
        photos: [] as File[],
        deleted_photos: [] as number[],
        processor: laptop?.specs?.processor || '',
        ram: laptop?.specs?.ram || '',
        storage: laptop?.specs?.storage || '',
        gpu: laptop?.specs?.gpu || '',
        display: laptop?.specs?.display || '',
        battery: laptop?.specs?.battery || '',
        os: laptop?.specs?.os || '',
        color: laptop?.specs?.color || '',
        year: laptop?.specs?.year || '',
    });

    const conditionOptions = [
        { value: 'new', label: t('laptops.conditions.new', { defaultValue: 'New' }) },
        { value: 'used', label: t('laptops.conditions.used', { defaultValue: 'Used' }) },
        { value: 'refurbished', label: t('laptops.conditions.refurbished', { defaultValue: 'Refurbished' }) },
        { value: 'for_parts', label: t('laptops.conditions.for_parts', { defaultValue: 'For parts' }) },
    ];

    const statusOptions = [
        { value: 'available', label: t('laptops.statuses.available', { defaultValue: 'Tersedia' }) },
        { value: 'sold', label: t('laptops.statuses.sold', { defaultValue: 'Terjual' }) },
    ];

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditMode) {
            handleUpdate();
        } else {
            form.post(route('laptops.store'), {
                forceFormData: true,
            });
        }
    };

    const handleUpdate = () => {
        show({
            title: t('common.confirm'),
            description: t('laptops.update_confirm', { defaultValue: 'Are you sure you want to update this laptop information? This action will save all changes.' }),
            variant: 'info',
            confirmText: t('common.confirm'),
            onConfirm: () => {
                form.put(route('laptops.update', laptop!.id), {
                    forceFormData: true,
                });
            },
        });
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>{isEditMode ? t('laptops.edit', { defaultValue: 'Edit Laptop' }) : t('laptops.create', { defaultValue: 'Create Laptop' })}</CardTitle>
                    <CardDescription>
                        {isEditMode
                            ? t('laptops.edit_description', { defaultValue: 'Update laptop inventory details' })
                            : t('laptops.create_description', { defaultValue: 'Create a new laptop inventory item' })}
                    </CardDescription>
                </CardHeader>
                <CardBody className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <FieldInput
                            id="model_name"
                            name="model_name"
                            label={t('laptops.model_name', { defaultValue: 'Model Name' })}
                            value={form.data.model_name}
                            onChange={(e) => form.setData('model_name', e.target.value)}
                            required
                            autoFocus
                            placeholder={t('laptops.model_name_placeholder', { defaultValue: 'Enter laptop model name' })}
                            error={form.errors.model_name}
                        />

                        <FieldInput
                            id="serial_number"
                            name="serial_number"
                            label={t('laptops.serial_number', { defaultValue: 'Serial Number' })}
                            value={form.data.serial_number}
                            onChange={(e) => form.setData('serial_number', e.target.value)}
                            placeholder={t('laptops.serial_number_placeholder', { defaultValue: 'Enter serial number' })}
                            error={form.errors.serial_number}
                        />

                        <FieldSelect
                            name="brand_id"
                            label={t('laptops.brand', { defaultValue: 'Brand' })}
                            value={form.data.brand_id}
                            onValueChange={(value) => form.setData('brand_id', value as string)}
                            placeholder={t('laptops.select_brand', { defaultValue: 'Select a brand' })}
                            options={brands.map((brand) => ({ label: brand.name, value: String(brand.id) }))}
                            required
                            error={form.errors.brand_id}
                        />

                        <FieldSelect
                            name="laptop_source_id"
                            label={t('laptops.laptop_source', { defaultValue: 'Laptop Source' })}
                            value={form.data.laptop_source_id}
                            onValueChange={(value) => form.setData('laptop_source_id', value as string)}
                            placeholder={t('laptops.select_laptop_source', { defaultValue: 'Select a laptop source' })}
                            options={laptopSources.map((source) => ({ label: source.name, value: String(source.id) }))}
                            required
                            error={form.errors.laptop_source_id}
                        />

                        <FieldSelect
                            name="condition"
                            label={t('laptops.condition', { defaultValue: 'Condition' })}
                            value={form.data.condition}
                            onValueChange={(value) => form.setData('condition', value as string)}
                            options={conditionOptions}
                            required
                            error={form.errors.condition}
                        />

                        <FieldSelect
                            name="status"
                            label={t('laptops.status', { defaultValue: 'Status' })}
                            value={form.data.status}
                            onValueChange={(value) => form.setData('status', value as string)}
                            options={statusOptions}
                            required
                            error={form.errors.status}
                        />

                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-medium">
                                {t('laptops.photos', { defaultValue: 'Photos' })}
                            </label>
                            <PhotoUpload
                                existingPhotos={existingPhotos}
                                onFilesChange={(files) => form.setData('photos', files)}
                                onDeleteExisting={(id) => form.setData('deleted_photos', [...form.data.deleted_photos, id])}
                                errors={form.errors.photos}
                            />
                        </div>
                    </div>
                </CardBody>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{t('laptops.specifications', { defaultValue: 'Specifications' })}</CardTitle>
                    <CardDescription>{t('laptops.specifications_description', { defaultValue: 'Record hardware and device specifications' })}</CardDescription>
                </CardHeader>
                <CardBody>
                    <div className="grid gap-6 md:grid-cols-2">
                        <FieldInput id="processor" name="processor" label={t('laptops.processor', { defaultValue: 'Processor' })} value={form.data.processor} onChange={(e) => form.setData('processor', e.target.value)} error={form.errors.processor} />
                        <FieldInput id="ram" name="ram" label={t('laptops.ram', { defaultValue: 'RAM' })} value={form.data.ram} onChange={(e) => form.setData('ram', e.target.value)} error={form.errors.ram} />
                        <FieldInput id="storage" name="storage" label={t('laptops.storage', { defaultValue: 'Storage' })} value={form.data.storage} onChange={(e) => form.setData('storage', e.target.value)} error={form.errors.storage} />
                        <FieldInput id="gpu" name="gpu" label={t('laptops.gpu', { defaultValue: 'GPU' })} value={form.data.gpu} onChange={(e) => form.setData('gpu', e.target.value)} error={form.errors.gpu} />
                        <FieldInput id="display" name="display" label={t('laptops.display', { defaultValue: 'Display' })} value={form.data.display} onChange={(e) => form.setData('display', e.target.value)} error={form.errors.display} />
                        <FieldInput id="battery" name="battery" label={t('laptops.battery', { defaultValue: 'Battery' })} value={form.data.battery} onChange={(e) => form.setData('battery', e.target.value)} error={form.errors.battery} />
                        <FieldInput id="os" name="os" label={t('laptops.os', { defaultValue: 'OS' })} value={form.data.os} onChange={(e) => form.setData('os', e.target.value)} error={form.errors.os} />
                        <FieldInput id="color" name="color" label={t('laptops.color', { defaultValue: 'Color' })} value={form.data.color} onChange={(e) => form.setData('color', e.target.value)} error={form.errors.color} />
                        <FieldInput id="year" name="year" label={t('laptops.year', { defaultValue: 'Year' })} value={form.data.year} onChange={(e) => form.setData('year', e.target.value)} error={form.errors.year} />
                    </div>
                </CardBody>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{t('laptops.pricing', { defaultValue: 'Pricing' })}</CardTitle>
                    <CardDescription>{t('laptops.pricing_description', { defaultValue: 'Track purchase, sale, and inventory notes' })}</CardDescription>
                </CardHeader>
                <CardBody className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-3">
                        <FieldInput
                            id="purchase_price"
                            name="purchase_price"
                            type="number"
                            min="0"
                            step="0.01"
                            label={t('laptops.purchase_price', { defaultValue: 'Purchase Price' })}
                            value={form.data.purchase_price}
                            onChange={(e) => form.setData('purchase_price', e.target.value)}
                            error={form.errors.purchase_price}
                        />

                        <FieldInput
                            id="selling_price"
                            name="selling_price"
                            type="number"
                            min="0"
                            step="0.01"
                            label={t('laptops.selling_price', { defaultValue: 'Selling Price' })}
                            value={form.data.selling_price}
                            onChange={(e) => form.setData('selling_price', e.target.value)}
                            error={form.errors.selling_price}
                        />

                        <FieldInput
                            id="purchase_date"
                            name="purchase_date"
                            type="date"
                            label={t('laptops.purchase_date', { defaultValue: 'Purchase Date' })}
                            value={form.data.purchase_date}
                            onChange={(e) => form.setData('purchase_date', e.target.value)}
                            error={form.errors.purchase_date}
                        />
                    </div>

                    <FieldTextarea
                        id="notes"
                        name="notes"
                        label={t('laptops.notes', { defaultValue: 'Notes' })}
                        value={form.data.notes}
                        onChange={(e) => form.setData('notes', e.target.value)}
                        placeholder={t('laptops.notes_placeholder', { defaultValue: 'Enter notes' })}
                        error={form.errors.notes}
                    />
                </CardBody>
            </Card>

            <div className="flex items-center gap-4">
                <Button variant="primary" type="submit" disabled={form.processing}>
                    <LucideSave />
                    {isEditMode ? t('common.save') : t('common.create')}
                </Button>
                <Link
                    as="button"
                    href={route('laptops.index')}
                    className={cn(buttonVariants({ variant: 'outline' }))}
                >
                    <LucideCircleX />
                    {t('common.cancel')}
                </Link>
            </div>
        </form>
    );
}

function formatDateForInput(value?: string | null): string {
    if (!value) {
        return '';
    }

    return value.slice(0, 10);
}
