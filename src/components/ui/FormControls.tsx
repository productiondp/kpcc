import React, { forwardRef, useId, useState } from 'react';

export const Label = ({ children, required, htmlFor, className = '' }: { children: React.ReactNode, required?: boolean, htmlFor?: string, className?: string }) => (
  <label htmlFor={htmlFor} className={`block text-xs font-semibold text-foreground/80 uppercase tracking-wider mb-2 ${className}`}>
    {children} {required && <span className="text-orange-500">*</span>}
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
          className={`w-full px-4 py-3 border bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm hover:border-gray-300 ${
            error ? 'border-destructive ring-destructive/20' : 'border-gray-200'
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
          className={`w-full px-4 py-3 border bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm hover:border-gray-300 min-h-[120px] resize-y ${
            error ? 'border-destructive ring-destructive/20' : 'border-gray-200'
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
          className={`w-full px-4 py-3 border bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm hover:border-gray-300 appearance-none ${
            error ? 'border-destructive ring-destructive/20' : 'border-gray-200'
          } ${className}`}
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236b7280\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.25em 1.25em' }}
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
        <div className="flex flex-wrap gap-3 mt-2">
          {options.map((opt) => (
            <label key={opt.value} className="flex items-center gap-3 cursor-pointer bg-white px-5 py-3 rounded-xl shadow-sm border hover:border-gray-300 transition-all has-[:checked]:border-primary has-[:checked]:bg-slate-50">
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={value === opt.value}
                onChange={onChange}
                ref={ref}
                className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
              />
              <span className="text-sm font-medium text-foreground">{opt.label}</span>
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
      <div className={`relative mt-2 border bg-white rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4 shadow-sm hover:border-gray-300 transition-all ${error ? 'border-destructive' : 'border-gray-200'}`}>
        
        {preview ? (
          <div className="shrink-0 relative w-16 h-16 overflow-hidden rounded-lg border bg-gray-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Preview" className="object-cover w-full h-full" />
          </div>
        ) : (
          <div className="shrink-0 w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
          </div>
        )}
        
        <div className="flex-1 text-center sm:text-left">
          <p className="text-sm font-semibold text-foreground">
            {preview ? 'File selected' : 'Upload file'}
          </p>
          <p className="text-xs text-foreground/60 mt-0.5">
            {accept?.includes('pdf') ? 'JPG, PNG, or PDF' : 'JPG or PNG'} (max. 4MB)
          </p>
        </div>
        
        <div className="shrink-0">
          <span className="text-xs font-semibold px-4 py-2 bg-slate-100 text-slate-700 rounded-lg group-hover:bg-slate-200 transition-colors pointer-events-none">
            {preview ? 'Replace' : 'Browse'}
          </span>
        </div>

        <input type="file" className="hidden" accept={accept} onChange={handleFileChange} />
        
        {/* The critical bug fix: the parent is now relative, so this button only covers this component */}
        <button type="button" onClick={(e) => {
          const parent = e.currentTarget.parentElement;
          if (parent) {
             const input = parent.querySelector('input');
             if (input) input.click();
          }
        }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" aria-label="Upload file" />
      </div>
      {error && <p className="text-destructive text-xs mt-1">{error}</p>}
    </div>
  );
};

export const SelectWithCustom = ({ label, options, required, value, onChange, placeholder = "Select an option", error }: { label: string, options: {label: string, value: string}[], required?: boolean, value: string, onChange: (val: string) => void, placeholder?: string, error?: string }) => {
  const generatedId = useId();
  
  // Determine if the current value is one of the predefined options, or if it's a custom value
  const isPredefined = options.some(opt => opt.value === value) || value === '';
  const [isCustomMode, setIsCustomMode] = useState(!isPredefined && value !== '');

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'OTHER_CUSTOM') {
      setIsCustomMode(true);
      onChange(''); // clear value when switching to custom
    } else {
      setIsCustomMode(false);
      onChange(val);
    }
  };

  return (
    <div className="w-full">
      {label && <Label htmlFor={generatedId} required={required}>{label}</Label>}
      
      {!isCustomMode ? (
        <select
          id={generatedId}
          value={value}
          onChange={handleSelectChange}
          className={`w-full px-4 py-3 border bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm hover:border-gray-300 appearance-none ${
            error ? 'border-destructive ring-destructive/20' : 'border-gray-200'
          }`}
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236b7280\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.25em 1.25em' }}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
          {/* Always add "Other" option if we support custom input */}
          <option value="OTHER_CUSTOM">Other (Please specify)</option>
        </select>
      ) : (
        <div className="relative animate-in fade-in zoom-in-95 duration-200">
          <input
            id={generatedId}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Please specify..."
            autoFocus
            className={`w-full px-4 py-3 border bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm hover:border-gray-300 pr-12 ${
              error ? 'border-destructive ring-destructive/20' : 'border-gray-200'
            }`}
          />
          <button 
            type="button"
            onClick={() => { setIsCustomMode(false); onChange(''); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
            title="Back to options"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
      )}
      
      {error && <p className="text-destructive text-xs mt-1">{error}</p>}
    </div>
  );
};

