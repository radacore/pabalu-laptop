import { Field, FieldItem, FieldError, FieldDescription } from '@/components/ui/field';
import { Radio, RadioGroup, RadioGroupLabel } from '@/components/ui/radio';
import { Required } from '@/components/form/required';
import * as React from 'react';

interface Option {
    label: React.ReactNode;
    value: string;
    description?: React.ReactNode;
}

interface FieldRadioProps extends React.ComponentProps<typeof RadioGroup> {
    label?: React.ReactNode;
    error?: string;
    required?: boolean;
    options: Option[];
    className?: string;
}

export function FieldRadio({ label, error, required, options, className, name, ...props }: FieldRadioProps) {
    const generatedId = React.useId();

    return (
        <Field invalid={!!error} className={className}>
            {label && (
                <RadioGroupLabel className="text-foreground flex items-center gap-1.5 font-medium mb-1">
                    {label}
                    {required && <Required />}
                </RadioGroupLabel>
            )}
            <RadioGroup name={name} required={required} {...props}>
                {options.map((option) => {
                    const optionId = `radio-${generatedId}-${option.value}`;
                    return (
                        <FieldItem key={option.value}>
                            <Radio id={optionId} value={option.value} />
                            <label
                                htmlFor={optionId}
                                className="text-sm font-medium leading-none cursor-pointer text-foreground"
                            >
                                {option.label}
                            </label>
                            {option.description && <FieldDescription>{option.description}</FieldDescription>}
                        </FieldItem>
                    );
                })}
            </RadioGroup>
            {error && <FieldError match={true}>{error}</FieldError>}
        </Field>
    );
}
