import { useTranslation } from 'react-i18next';
import { FieldInput } from '@/components/form/field-input';
import { FieldSelect } from '@/components/form/field-select';
import { FieldTextarea } from '@/components/form/field-textarea';
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Link, useForm } from '@inertiajs/react';
import { LucideCirclePlus, LucideCircleX, LucideSave, LucideTrash2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useConfirmDialogStore } from '@/stores/confirm-dialog-store';
import { PhotoUpload } from '@/features/laptop/photo-upload';
import type { Service, ServiceOption, ServicePart, ServiceStatusOption } from './types';

interface ServiceFormProps {
    customers: ServiceOption[];
    laptops: ServiceOption[];
    serviceCategories: ServiceOption[];
    statuses: ServiceStatusOption[];
    service?: Service;
    mode?: 'create' | 'edit';
}

interface PartFormData {
    part_name: string;
    quantity: string;
    unit_price: string;
}

interface ServiceFormData {
    customer_id: string;
    laptop_id: string;
    service_category_id: string;
    laptop_model: string;
    laptop_serial: string;
    issue_description: string;
    diagnosis: string;
    status: string;
    estimated_cost: string;
    final_cost: string;
    down_payment: string;
    pickup_date: string;
    completion_date: string;
    notes: string;
    parts: PartFormData[];
    photos: File[];
    deleted_photos: number[];
}

export function ServiceForm({ customers, laptops, serviceCategories, statuses, service, mode = 'create' }: ServiceFormProps) {
    const { t } = useTranslation();
    const isEditMode = mode === 'edit';
    const { show } = useConfirmDialogStore();
    const existingServicePhotos = service?.photos || [];

    const form = useForm<ServiceFormData>({
        customer_id: service?.customer_id ? String(service.customer_id) : '',
        laptop_id: service?.laptop_id ? String(service.laptop_id) : '',
        service_category_id: service?.service_category_id ? String(service.service_category_id) : '',
        laptop_model: service?.laptop_model || '',
        laptop_serial: service?.laptop_serial || '',
        issue_description: service?.issue_description || '',
        diagnosis: service?.diagnosis || '',
        status: service?.status || 'received',
        estimated_cost: service?.estimated_cost || '',
        final_cost: service?.final_cost || '',
        down_payment: service?.down_payment || '',
        pickup_date: formatDateForInput(service?.pickup_date),
        completion_date: formatDateForInput(service?.completion_date),
        notes: service?.notes || '',
        parts: (service?.parts || []).map(formatPartForForm),
        photos: [] as File[],
        deleted_photos: [] as number[],
    });

    const statusOptions = statuses.map((status) => ({
        value: status.value,
        label: t(`services.statuses.${status.value}`, { defaultValue: status.label }),
    }));

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.transform((data) => ({
            ...data,
            laptop_id: data.laptop_id || null,
            parts: data.parts.filter((part) => part.part_name.trim() !== ''),
        }));

        if (isEditMode) {
            handleUpdate();
        } else {
            form.post(route('services.store'), {
                forceFormData: true,
            });
        }
    };

    const handleUpdate = () => {
        show({
            title: t('common.confirm'),
            description: t('services.update_confirm', { defaultValue: 'Are you sure you want to update this service information? This action will save all changes.' }),
            variant: 'info',
            confirmText: t('common.confirm'),
            onConfirm: () => {
                form.put(route('services.update', service!.id), {
                    forceFormData: true,
                });
            },
        });
    };

    const addPart = () => {
        form.setData('parts', [...form.data.parts, { part_name: '', quantity: '1', unit_price: '0' }]);
    };

    const updatePart = (index: number, key: keyof PartFormData, value: string) => {
        form.setData('parts', form.data.parts.map((part, partIndex) => partIndex === index ? { ...part, [key]: value } : part));
    };

    const removePart = (index: number) => {
        form.setData('parts', form.data.parts.filter((_, partIndex) => partIndex !== index));
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>{isEditMode ? t('services.edit', { defaultValue: 'Edit Service' }) : t('services.create', { defaultValue: 'Create Service' })}</CardTitle>
                    <CardDescription>
                        {isEditMode
                            ? t('services.edit_description', { defaultValue: 'Update service details and tracking information' })
                            : t('services.create_description', { defaultValue: 'Create a new service request' })}
                    </CardDescription>
                </CardHeader>
                <CardBody className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <FieldSelect
                            name="customer_id"
                            label={t('services.customer', { defaultValue: 'Customer' })}
                            value={form.data.customer_id}
                            onValueChange={(value) => form.setData('customer_id', value as string)}
                            options={customers.map((customer) => ({ value: String(customer.id), label: customer.name }))}
                            required
                            placeholder={t('services.customer_placeholder', { defaultValue: 'Select customer' })}
                            error={form.errors.customer_id}
                        />
                        <FieldSelect
                            name="service_category_id"
                            label={t('services.service_category', { defaultValue: 'Service Category' })}
                            value={form.data.service_category_id}
                            onValueChange={(value) => form.setData('service_category_id', value as string)}
                            options={serviceCategories.map((category) => ({ value: String(category.id), label: category.name }))}
                            required
                            placeholder={t('services.service_category_placeholder', { defaultValue: 'Select service category' })}
                            error={form.errors.service_category_id}
                        />
                        <FieldSelect
                            name="laptop_id"
                            label={t('services.laptop', { defaultValue: 'Laptop' })}
                            value={form.data.laptop_id || 'none'}
                            onValueChange={(value) => form.setData('laptop_id', value === 'none' ? '' : value as string)}
                            options={[{ value: 'none', label: t('services.no_laptop', { defaultValue: 'No linked laptop' }) }, ...laptops.map((laptop) => ({ value: String(laptop.id), label: laptop.name }))]}
                            placeholder={t('services.laptop_placeholder', { defaultValue: 'Select laptop' })}
                            error={form.errors.laptop_id}
                        />
                        {isEditMode && (
                            <FieldSelect
                                name="status"
                                label={t('services.status', { defaultValue: 'Status' })}
                                value={form.data.status}
                                onValueChange={(value) => form.setData('status', value as string)}
                                options={statusOptions}
                                required
                                error={form.errors.status}
                            />
                        )}
                        <FieldInput
                            id="laptop_model"
                            name="laptop_model"
                            label={t('services.laptop_model', { defaultValue: 'Laptop Model' })}
                            value={form.data.laptop_model}
                            onChange={(e) => form.setData('laptop_model', e.target.value)}
                            placeholder={t('services.laptop_model_placeholder', { defaultValue: 'Enter laptop model' })}
                            error={form.errors.laptop_model}
                        />
                        <FieldInput
                            id="laptop_serial"
                            name="laptop_serial"
                            label={t('services.laptop_serial', { defaultValue: 'Laptop Serial' })}
                            value={form.data.laptop_serial}
                            onChange={(e) => form.setData('laptop_serial', e.target.value)}
                            placeholder={t('services.laptop_serial_placeholder', { defaultValue: 'Enter serial number' })}
                            error={form.errors.laptop_serial}
                        />
                    </div>

                    <FieldTextarea
                        id="issue_description"
                        name="issue_description"
                        label={t('services.issue_description', { defaultValue: 'Issue Description' })}
                        value={form.data.issue_description}
                        onChange={(e) => form.setData('issue_description', e.target.value)}
                        required
                        placeholder={t('services.issue_description_placeholder', { defaultValue: 'Describe the issue' })}
                        rows={4}
                        error={form.errors.issue_description}
                    />
                    <FieldTextarea
                        id="diagnosis"
                        name="diagnosis"
                        label={t('services.diagnosis', { defaultValue: 'Diagnosis' })}
                        value={form.data.diagnosis}
                        onChange={(e) => form.setData('diagnosis', e.target.value)}
                        placeholder={t('services.diagnosis_placeholder', { defaultValue: 'Enter diagnosis notes' })}
                        rows={4}
                        error={form.errors.diagnosis}
                    />
                </CardBody>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{t('services.costs_and_dates', { defaultValue: 'Costs and Dates' })}</CardTitle>
                </CardHeader>
                <CardBody className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-3">
                        <FieldInput id="estimated_cost" name="estimated_cost" type="number" min="0" step="0.01" label={t('services.estimated_cost', { defaultValue: 'Estimated Cost' })} value={form.data.estimated_cost} onChange={(e) => form.setData('estimated_cost', e.target.value)} error={form.errors.estimated_cost} />
                        <FieldInput id="final_cost" name="final_cost" type="number" min="0" step="0.01" label={t('services.final_cost', { defaultValue: 'Final Cost' })} value={form.data.final_cost} onChange={(e) => form.setData('final_cost', e.target.value)} error={form.errors.final_cost} />
                        <FieldInput id="down_payment" name="down_payment" type="number" min="0" step="0.01" label={t('services.down_payment', { defaultValue: 'Down Payment' })} value={form.data.down_payment} onChange={(e) => form.setData('down_payment', e.target.value)} error={form.errors.down_payment} />
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                        <FieldInput id="pickup_date" name="pickup_date" type="date" label={t('services.pickup_date', { defaultValue: 'Pickup Date' })} value={form.data.pickup_date} onChange={(e) => form.setData('pickup_date', e.target.value)} error={form.errors.pickup_date} />
                        <FieldInput id="completion_date" name="completion_date" type="date" label={t('services.completion_date', { defaultValue: 'Completion Date' })} value={form.data.completion_date} onChange={(e) => form.setData('completion_date', e.target.value)} error={form.errors.completion_date} />
                    </div>
                    <FieldTextarea id="notes" name="notes" label={t('services.notes', { defaultValue: 'Notes' })} value={form.data.notes} onChange={(e) => form.setData('notes', e.target.value)} rows={4} error={form.errors.notes} />
                </CardBody>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>{t('services.parts', { defaultValue: 'Parts' })}</CardTitle>
                        <CardDescription>{t('services.parts_description', { defaultValue: 'Track parts used for this service' })}</CardDescription>
                    </div>
                    <Button type="button" variant="secondary" size="sm" onClick={addPart}>
                        <LucideCirclePlus className="size-4" />
                        {t('services.add_part', { defaultValue: 'Add Part' })}
                    </Button>
                </CardHeader>
                <CardBody className="space-y-4">
                    {form.data.parts.length === 0 && <p className="text-sm text-muted-foreground">{t('services.no_parts', { defaultValue: 'No parts added yet.' })}</p>}
                    {form.data.parts.map((part, index) => (
                        <div key={index} className="grid gap-4 md:grid-cols-[1fr_120px_160px_auto] items-end">
                            <FieldInput label={t('services.part_name', { defaultValue: 'Part Name' })} value={part.part_name} onChange={(e) => updatePart(index, 'part_name', e.target.value)} error={(form.errors as Record<string, string>)[`parts.${index}.part_name`]} />
                            <FieldInput type="number" min="1" label={t('services.quantity', { defaultValue: 'Quantity' })} value={part.quantity} onChange={(e) => updatePart(index, 'quantity', e.target.value)} error={(form.errors as Record<string, string>)[`parts.${index}.quantity`]} />
                            <FieldInput type="number" min="0" step="0.01" label={t('services.unit_price', { defaultValue: 'Unit Price' })} value={part.unit_price} onChange={(e) => updatePart(index, 'unit_price', e.target.value)} error={(form.errors as Record<string, string>)[`parts.${index}.unit_price`]} />
                            <Button type="button" variant="danger" size="sm" onClick={() => removePart(index)}>
                                <LucideTrash2 className="size-4" />
                                <span className="hidden md:inline">{t('common.delete')}</span>
                            </Button>
                        </div>
                    ))}
                </CardBody>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{t('services.photo', { defaultValue: 'Photo' })}</CardTitle>
                </CardHeader>
                <CardBody className="space-y-6">
                    <label className="mb-1 block text-sm font-medium">
                        {t('services.photos', { defaultValue: 'Photos' })}
                    </label>
                    <PhotoUpload
                        existingPhotos={existingServicePhotos.map((p) => ({ id: p.id, photo_path: p.photo_path, is_primary: false }))}
                        onFilesChange={(files) => form.setData('photos', files)}
                        onDeleteExisting={(id) => form.setData('deleted_photos', [...form.data.deleted_photos, id])}
                        errors={form.errors.photos}
                    />
                    <div className="flex justify-end gap-4">
                        <Link href={route('services.index')} className={cn(buttonVariants({ variant: 'secondary' }))}>
                            <LucideCircleX />
                            {t('common.cancel')}
                        </Link>
                        <Button type="submit" variant="primary" disabled={form.processing}>
                            <LucideSave />
                            {t('common.save')}
                        </Button>
                    </div>
                </CardBody>
            </Card>
        </form>
    );
}

function formatDateForInput(value?: string | null): string {
    if (!value) {
        return '';
    }

    return value.slice(0, 10);
}

function formatPartForForm(part: ServicePart): PartFormData {
    return {
        part_name: part.part_name,
        quantity: String(part.quantity),
        unit_price: part.unit_price,
    };
}
