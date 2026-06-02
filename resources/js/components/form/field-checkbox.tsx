import { Field, FieldItem, FieldError, FieldDescription } from '@/components/ui/field';
import { Checkbox } from '@/components/ui/checkbox';
import { Required } from '@/components/form/required';
import * as React from 'react';

interface FieldCheckboxProps extends React.ComponentProps<typeof Checkbox> {
    label: React.ReactNode;
    description?: React.ReactNode;
    error?: string;
    required?: boolean;
    className?: string;
}

export function FieldCheckbox({ label, description, error, required, className, id, name, ...props }: FieldCheckboxProps) {
    const generatedId = React.useId();
    const checkboxId = id || generatedId;

    return (
        <Field invalid={!!error} className={className}>
            <FieldItem>
                <Checkbox id={checkboxId} name={name} required={required} {...props} />
                <label
                    htmlFor={checkboxId}
                    className="text-sm font-medium leading-none cursor-pointer text-foreground flex items-center gap-1.5"
                >
                    {label}
                    {required && <Required />}
                </label>
                {description && <FieldDescription>{description}</FieldDescription>}
            </FieldItem>
            {error && <FieldError match={true}>{error}</FieldError>}
        </Field>
    );
}
