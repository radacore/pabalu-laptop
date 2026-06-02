import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Required } from '@/components/form/required';
import * as React from 'react';

interface FieldInputProps extends React.ComponentProps<typeof Input> {
    label?: React.ReactNode;
    error?: string;
    name?: string;
}

export function FieldInput({ label, error, required, id, name, className, ...props }: FieldInputProps) {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
        <Field invalid={!!error} className={className}>
            {label && (
                <FieldLabel htmlFor={inputId}>
                    {label}
                    {required && <Required />}
                </FieldLabel>
            )}
            <Input id={inputId} name={name} required={required} {...props} />
            {error && <FieldError match={true}>{error}</FieldError>}
        </Field>
    );
}
