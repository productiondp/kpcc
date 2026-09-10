import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '../ui/FormControls';
import { FormData } from '@/lib/types';

export default function Step5Declaration() {
  const { register, formState: { errors } } = useFormContext<FormData>();

  return (
    <div className="space-y-6">
      <div className="mb-6 pb-2 border-b">
        <h2 className="text-2xl font-semibold text-primary">Declaration</h2>
        <p className="text-sm text-foreground/60">Please read carefully and sign to complete your application.</p>
      </div>

      <div className="p-6 bg-primary text-primary-foreground rounded-lg shadow-inner">
        <p className="text-lg leading-relaxed font-serif italic text-center">
          &quot;I hereby declare that the above information is true to the best of my knowledge. I agree to abide by the Constitution and Guidelines of the KPCC Industries Cell and understand that failure to do so may result in the termination of my membership.&quot;
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div className="space-y-6">
          <Input 
            label="Date" 
            type="date"
            {...register('declarationDate')}
          />
          <Input 
            label="Place" 
            placeholder="e.g. Thiruvananthapuram"
            {...register('declarationPlace')}
          />
        </div>
        
        <div className="flex flex-col justify-end space-y-2">
          <div className="border-b-2 border-primary/50 pb-2">
            <Input 
              label="Signature of Applicant (Type Full Name)" 
              placeholder="Digital Signature"
              required
              {...register('signatureName', { required: 'Please type your name as a signature' })}
              error={errors.signatureName?.message}
              className="font-serif italic text-lg bg-secondary/20"
            />
          </div>
          <p className="text-xs text-foreground/60 text-right">By typing your name, you are signing this application electronically.</p>
        </div>
      </div>
    </div>
  );
}
