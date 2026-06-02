import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import { Required } from '@/components/form/required';
import * as React from 'react';

interface FieldTextareaProps extends React.ComponentProps<typeof Textarea> {
    label?: React.ReactNode;
    error?: string;
    name?: string;
}

export function FieldTextarea({ label, error, required, id, name, className, ...props }: FieldTextareaProps) {
    const generatedId = React.useId();
    const textareaId = id || generatedId;

    return (
        <Field invalid={!!error} className={className}>
            {label && (
                <FieldLabel htmlFor={textareaId}>
                    {label}
                    {required && <Required />}
                </FieldLabel>
            )}
            <Textarea id={textareaId} name={name} required={required} {...props} />
            {error && <FieldError match={true}>{error}</FieldError>}
        </Field>
    );
}
