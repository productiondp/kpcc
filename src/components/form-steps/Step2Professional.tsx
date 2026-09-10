import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input, RadioGroup, Textarea, SelectWithCustom } from '../ui/FormControls';
import { FormData } from '@/lib/types';

export default function Step2Professional() {
  const { register, control, formState: { errors } } = useFormContext<FormData>();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-primary mb-2">Educational & Professional Details</h2>
        <p className="text-sm text-foreground/60">Provide your current occupation and business details.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Controller
            name="education"
            control={control}
            rules={{ required: 'Education is required' }}
            render={({ field }) => (
              <SelectWithCustom 
                label="09. Educational Qualification" 
                placeholder="Select qualification"
                options={[
                  { label: 'SSLC', value: 'SSLC' },
                  { label: 'Plus Two / Higher Secondary', value: 'Plus Two / Higher Secondary' },
                  { label: 'ITI', value: 'ITI' },
                  { label: 'Diploma', value: 'Diploma' },
                  { label: 'Undergraduate / Degree', value: 'Undergraduate / Degree' },
                  { label: 'Postgraduate', value: 'Postgraduate' },
                  { label: 'M.Phil', value: 'M.Phil' },
                  { label: 'Ph.D.', value: 'Ph.D.' },
                  { label: 'Professional Qualification', value: 'Professional Qualification' }
                ]}
                required
                value={field.value || ''}
                onChange={field.onChange}
                error={errors.education?.message}
              />
            )}
          />
        </div>

        <Controller
          name="designation"
          control={control}
          render={({ field }) => (
            <SelectWithCustom 
              label="10. Designation (if applicable)" 
              placeholder="Select designation"
              options={[
                { label: 'Proprietor', value: 'Proprietor' },
                { label: 'Partner', value: 'Partner' },
                { label: 'Director', value: 'Director' },
                { label: 'Managing Director', value: 'Managing Director' },
                { label: 'CEO', value: 'CEO' },
                { label: 'Chairman', value: 'Chairman' },
                { label: 'Managing Partner', value: 'Managing Partner' },
                { label: 'General Manager', value: 'General Manager' },
                { label: 'Manager', value: 'Manager' },
                { label: 'Consultant', value: 'Consultant' },
                { label: 'Professional', value: 'Professional' },
                { label: 'Employee', value: 'Employee' }
              ]}
              value={field.value || ''}
              onChange={field.onChange}
            />
          )}
        />

        <Input 
          label="11. Name of Organization / Company / Business" 
          placeholder="Enter company name"
          required
          {...register('organization', { required: 'Organization name is required' })}
          error={errors.organization?.message}
        />

        <div className="md:col-span-2">
          <Controller
            name="sector"
            control={control}
            render={({ field }) => (
              <SelectWithCustom
                label="12. Sector / Industry"
                options={[
                  { label: 'Manufacturing', value: 'Manufacturing' },
                  { label: 'Service', value: 'Service' },
                  { label: 'Trading', value: 'Trading' },
                  { label: 'Agriculture', value: 'Agriculture' }
                ]}
                value={field.value || ''}
                onChange={field.onChange}
              />
            )}
          />
        </div>

        <div className="md:col-span-2">
          <Textarea 
            label="13. Office Address" 
            placeholder="Enter complete office address"
            {...register('officeAddress')}
          />
        </div>

        <Input 
          label="Pin Code (Office)" 
          placeholder="e.g. 695010"
          {...register('officePinCode')}
        />

        <Input 
          label="14. Office Contact No" 
          type="tel"
          {...register('officeContact')}
        />

        <div className="md:col-span-2">
          <Input 
            label="15. Office Email / Website" 
            placeholder="e.g. contact@company.com or www.company.com"
            {...register('officeEmail')}
          />
        </div>

        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-secondary/30 rounded-lg border border-border">
          <Controller
            name="gstStatus"
            control={control}
            render={({ field }) => (
              <RadioGroup
                label="16. GST Registration Status"
                name="gstStatus"
                options={[
                  { label: 'Registered', value: 'Registered' },
                  { label: 'Not Registered', value: 'Not Registered' }
                ]}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />

          <Controller
            name="gstType"
            control={control}
            render={({ field }) => {
              // Read the current status directly to dynamically disable this field
              const { getValues } = useFormContext<FormData>();
              const status = getValues('gstStatus');
              const disabled = status === 'Not Registered';
              
              return (
                <div className={disabled ? 'opacity-50 pointer-events-none' : ''}>
                  <RadioGroup
                    label="17. Type of GST Registration"
                    name="gstType"
                    options={[
                      { label: 'Regular', value: 'Regular' },
                      { label: 'Composition Scheme', value: 'Composition Scheme' }
                    ]}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </div>
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}
