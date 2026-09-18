import { useId } from 'react';
import type { InputHTMLAttributes, Ref } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    ref?: Ref<HTMLInputElement>;
}

export function Input({ label, error, hint, className = '', id, ...props }: InputProps) {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
        <div className="field">
            {label && (
                <label className="field-label" htmlFor={inputId}>
                    {label}
                </label>
            )}

            <input
                id={inputId}
                className={`field-input${error ? ' has-error' : ''} ${className}`.trim()}
                aria-invalid={error ? true : undefined}
                {...props}
            />

            {error ? (
                <p className="field-error">{error}</p>
            ) : hint ? (
                <p className="field-hint">{hint}</p>
            ) : null}
        </div>
    );
}
