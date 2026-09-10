import React, { forwardRef, useId } from 'react';

export const Label = ({ children, required, htmlFor, className = '' }: { children: React.ReactNode, required?: boolean, htmlFor?: string, className?: string }) => (
  <label htmlFor={htmlFor} className={`block text-sm font-medium text-foreground mb-1 ${className}`}>
    {children} {required && <span className="text-destructive">*</span>}
  </label>
);

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { label?: string, error?: string }>(
  ({ label, error, className = '', required, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    return (
      <div className="w-full">
        {label && <Label htmlFor={inputId} required={required}>{label}</Label>}
        <input
          id={inputId}
          ref={ref}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors ${
            error ? 'border-destructive ring-destructive/20' : 'border-border'
          } ${className}`}
          {...props}
        />
        {error && <p className="text-destructive text-xs mt-1">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string, error?: string }>(
  ({ label, error, className = '', required, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    return (
      <div className="w-full">
        {label && <Label htmlFor={inputId} required={required}>{label}</Label>}
        <textarea
          id={inputId}
          ref={ref}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors min-h-[100px] ${
            error ? 'border-destructive ring-destructive/20' : 'border-border'
          } ${className}`}
          {...props}
        />
        {error && <p className="text-destructive text-xs mt-1">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string, options: {label: string, value: string}[], error?: string }>(
  ({ label, options, error, className = '', required, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    return (
      <div className="w-full">
        {label && <Label htmlFor={inputId} required={required}>{label}</Label>}
        <select
          id={inputId}
          ref={ref}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors bg-white ${
            error ? 'border-destructive ring-destructive/20' : 'border-border'
          } ${className}`}
          {...props}
        >
          <option value="" disabled>Select an option</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {error && <p className="text-destructive text-xs mt-1">{error}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';

export const RadioGroup = forwardRef<HTMLInputElement, { label?: string, name: string, options: {label: string, value: string}[], error?: string, required?: boolean, value?: string, onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void }>(
  ({ label, name, options, error, required, value, onChange }, ref) => {
    return (
      <div className="w-full">
        {label && <Label required={required}>{label}</Label>}
        <div className="flex flex-wrap gap-4 mt-2">
          {options.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer bg-secondary/50 px-4 py-2 rounded-md hover:bg-secondary transition-colors border border-transparent has-[:checked]:border-ring has-[:checked]:bg-orange-50">
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={value === opt.value}
                onChange={onChange}
                ref={ref}
                className="w-4 h-4 text-ring focus:ring-ring"
              />
              <span className="text-sm font-medium">{opt.label}</span>
            </label>
          ))}
        </div>
        {error && <p className="text-destructive text-xs mt-1">{error}</p>}
      </div>
    );
  }
);
RadioGroup.displayName = 'RadioGroup';

export const FileUpload = ({ label, required, accept, onChange, error, preview }: { label: string, required?: boolean, accept?: string, onChange: (base64: string) => void, error?: string, preview?: string }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full">
      <Label required={required}>{label}</Label>
      <div className={`mt-1 border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-secondary/50 transition-colors ${error ? 'border-destructive' : 'border-border'}`}>
        {preview ? (
          <div className="relative w-32 h-32 mb-4 overflow-hidden rounded-md border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Preview" className="object-cover w-full h-full" />
          </div>
        ) : (
          <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
          </div>
        )}
        <p className="text-sm font-medium">Click to upload or drag and drop</p>
        <p className="text-xs text-muted-foreground mt-1">SVG, PNG, JPG or PDF (max. 5MB)</p>
        <input type="file" className="hidden" accept={accept} onChange={handleFileChange} />
        <button type="button" onClick={(e) => {
          const parent = e.currentTarget.parentElement;
          if (parent) {
             const input = parent.querySelector('input');
             if (input) input.click();
          }
        }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
      </div>
      {error && <p className="text-destructive text-xs mt-1">{error}</p>}
    </div>
  );
};
