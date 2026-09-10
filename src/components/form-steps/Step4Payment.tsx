import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input, RadioGroup } from '../ui/FormControls';
import { FormData } from '@/lib/types';

export default function Step4Payment() {
  const { register, control, formState: { errors } } = useFormContext<FormData>();

  return (
    <div className="space-y-6">
      <div className="mb-6 pb-2 border-b">
        <h2 className="text-2xl font-semibold text-primary">Membership Fee Details</h2>
        <p className="text-sm text-foreground/60">Provide the details of your membership fee payment.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Input 
            label="22. Membership Fee Amount: Rs." 
            type="number"
            placeholder="0.00"
            required
            {...register('feeAmount', { required: 'Fee amount is required' })}
            error={errors.feeAmount?.message}
          />
        </div>

        <div className="md:col-span-2 p-4 bg-secondary/30 rounded-lg border border-border">
          <Controller
            name="paymentMode"
            control={control}
            rules={{ required: 'Please select a payment mode' }}
            render={({ field }) => (
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-1">
                  <RadioGroup
                    label="23. Mode of Payment"
                    name="paymentMode"
                    required
                    options={[
                      { label: 'Cash', value: 'Cash' },
                      { label: 'Online', value: 'Online' },
                      { label: 'Cheque', value: 'Cheque' }
                    ]}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.paymentMode?.message}
                  />
                </div>
                {field.value === 'Online' && (
                  <div className="shrink-0 bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center min-w-[160px] animate-in fade-in zoom-in-95 duration-300">
                    <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Scan to Pay</p>
                    <div className="w-24 h-24 bg-gray-100 border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400 text-xs text-center p-2">
                      Official QR Asset Required
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2 text-center">Attach transaction ref below</p>
                  </div>
                )}
              </div>
            )}
          />
        </div>

        <Input 
          label="24. Date of Payment" 
          type="date"
          {...register('paymentDate')}
        />

        <Input 
          label="Payment Transaction Ref / Cheque No:" 
          placeholder="Enter reference number"
          {...register('transactionRef')}
        />
      </div>
    </div>
  );
}
