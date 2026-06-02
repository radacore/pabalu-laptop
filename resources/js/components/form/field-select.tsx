import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Select, SelectItem, SelectList, SelectPopup, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Required } from '@/components/form/required';
import * as React from 'react';

interface Option {
    label: React.ReactNode;
    value: string;
}

interface FieldSelectProps extends React.ComponentProps<typeof Select> {
    label?: React.ReactNode;
    error?: string;
    required?: boolean;
    placeholder?: string;
    options: Option[];
    className?: string;
    name?: string;
}

export function FieldSelect({ label, error, required, placeholder, options, className, name, ...props }: FieldSelectProps) {
    return (
        <Field invalid={!!error} className={className}>
            {label && (
                <FieldLabel>
                    {label}
                    {required && <Required />}
                </FieldLabel>
            )}
            <Select name={name} {...props}>
                <SelectTrigger>
                    <SelectValue placeholder={placeholder} options={options.map(o => ({ value: o.value, label: o.label }))} />
                </SelectTrigger>
                <SelectPopup>
                    <SelectList>
                        {options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectList>
                </SelectPopup>
            </Select>
            {error && <FieldError match={true}>{error}</FieldError>}
        </Field>
    );
}
