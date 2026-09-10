import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { RadioGroup, Textarea } from '../ui/FormControls';
import { FormData } from '@/lib/types';

export default function Step3Involvement() {
  const { register, control, formState: { errors } } = useFormContext<FormData>();

  return (
    <div className="space-y-6">
      <div className="mb-6 pb-2 border-b">
        <h2 className="text-2xl font-semibold text-primary">Organizational / Political Involvement</h2>
        <p className="text-sm text-foreground/60">Provide details regarding your political affiliation and memberships.</p>
      </div>

      <div className="space-y-6">
        <div className="p-4 bg-secondary/30 rounded-lg border border-border">
          <Controller
            name="isIncMember"
            control={control}
            rules={{ required: 'Please select an option' }}
            render={({ field }) => (
              <RadioGroup
                label="18. Are you a member of Indian National Congress?"
                name="isIncMember"
                required
                options={[
                  { label: 'Yes', value: 'Yes' },
                  { label: 'No', value: 'No' }
                ]}
                value={field.value}
                onChange={field.onChange}
                error={errors.isIncMember?.message}
              />
            )}
          />
        </div>

        <Textarea 
          label="19. Past / Present roles in KSU / IYC / DCC / BCC / Other:" 
          placeholder="List any roles you have held or currently hold"
          {...register('pastRoles')}
        />

        <Textarea 
          label="20. Membership in Trade / Industry Associations (if any):" 
          placeholder="e.g. CII, FICCI, local trade bodies"
          {...register('tradeAssoc')}
        />

        <Textarea 
          label="21. Social / Voluntary Organization memberships:" 
          placeholder="e.g. Rotary, Lions Club, NGOs"
          {...register('socialOrgs')}
        />
      </div>
    </div>
  );
}
