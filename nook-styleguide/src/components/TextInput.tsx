import {useId, type InputHTMLAttributes} from 'react';
export type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {label?: string; error?: string};
export function TextInput({label = 'Email address', error, id, className = '', ...props}: TextInputProps) {
 const generatedId = useId(); const inputId = id || generatedId;
 return <div className={`nook-field ${className}`}><label className="sr-only" htmlFor={inputId}>{label}</label><input placeholder="Your email address" {...props} id={inputId} aria-invalid={error ? true : props['aria-invalid']} aria-describedby={error ? `${inputId}-error` : props['aria-describedby']} />{error && <p id={`${inputId}-error`} className="nook-error">{error}</p>}</div>;
}
