import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input, RadioGroup, Textarea } from '../ui/FormControls';
import { FormData } from '@/lib/types';

export default function Step2Professional() {
  const { register, control, formState: { errors } } = useFormContext<FormData>();

  return (
    <div className="space-y-6">
      <div className="mb-6 pb-2 border-b">
        <h2 className="text-2xl font-semibold text-primary">Educational & Professional Details</h2>
        <p className="text-sm text-foreground/60">Provide information regarding your education and business/profession.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Input 
            label="09. Educational Qualification" 
            placeholder="e.g. B.Tech, MBA, B.Com"
            required
            {...register('education', { required: 'Education is required' })}
            error={errors.education?.message}
          />
        </div>

        <Input 
          label="10. Designation (if applicable)" 
          placeholder="e.g. Managing Director, Partner, Proprietor"
          {...register('designation')}
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
              <RadioGroup
                label="12. Sector / Industry"
                name="sector"
                options={[
                  { label: 'Manufacturing', value: 'Manufacturing' },
                  { label: 'Service', value: 'Service' },
                  { label: 'Trading', value: 'Trading' },
                  { label: 'Agriculture', value: 'Agriculture' },
                  { label: 'Other', value: 'Other' }
                ]}
                value={field.value}
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
            render={({ field }) => (
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
            )}
          />
        </div>
      </div>
    </div>
  );
}
