import { ReactNode } from 'react';

interface FormSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function FormSection({ title, children, className = '' }: FormSectionProps) {
  return (
    <div className={`form-section ${className}`}>
      <h3 className="form-section-title">{title}</h3>
      {children}
    </div>
  );
}
