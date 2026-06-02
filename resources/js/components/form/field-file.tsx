import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Required } from '@/components/form/required';
import * as React from 'react';

interface FieldFileProps extends React.ComponentProps<typeof Input> {
    label?: React.ReactNode;
    error?: string;
    name?: string;
}

export function FieldFile({ label, error, required, id, name, className, ...props }: FieldFileProps) {
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
            <Input type="file" id={inputId} name={name} required={required} {...props} />
            {error && <FieldError match={true}>{error}</FieldError>}
        </Field>
    );
}
