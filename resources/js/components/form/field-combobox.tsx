import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Combobox, ComboboxInput, ComboboxItem, ComboboxList, ComboboxPopup, ComboboxSearch, ComboboxEmpty } from '@/components/ui/combobox';
import { Required } from '@/components/form/required';
import * as React from 'react';

interface Option {
    label: string;
    value: string;
    icon?: React.ReactNode;
}

interface FieldComboboxProps extends React.ComponentProps<typeof Combobox> {
    label?: React.ReactNode;
    error?: string;
    required?: boolean;
    placeholder?: string;
    options: Option[];
    className?: string;
}

export function FieldCombobox({ label, error, required, placeholder = 'Select an option', options, className, name, ...props }: FieldComboboxProps) {
    const generatedId = React.useId();

    return (
        <Field invalid={!!error} className={className}>
            {label && (
                <FieldLabel>
                    {label}
                    {required && <Required />}
                </FieldLabel>
            )}
            <Combobox name={name} {...props}>
                <ComboboxInput placeholder={placeholder} />
                <ComboboxPopup>
                    <ComboboxSearch />
                    <ComboboxList>
                        {options.length === 0 ? (
                            <ComboboxEmpty>No results found</ComboboxEmpty>
                        ) : (
                            options.map((option) => (
                                <ComboboxItem key={option.value} value={option}>
                                    {option.icon}
                                    {option.label}
                                </ComboboxItem>
                            ))
                        )}
                    </ComboboxList>
                </ComboboxPopup>
            </Combobox>
            {error && <FieldError match={true}>{error}</FieldError>}
        </Field>
    );
}
