import type { ButtonHTMLAttributes } from 'react';
export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' };
export function Button({variant = 'primary', type = 'button', className = '', children = 'Reserve your spot', ...props}: ButtonProps) {
 return <button type={type} className={`nook-button nook-button--${variant} ${className}`} {...props}>{children}</button>;
}
