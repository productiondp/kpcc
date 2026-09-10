import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '../ui/FormControls';
import { FormData } from '@/lib/types';

export default function Step6OfficeUse() {
  const { register } = useFormContext<FormData>();
  return (
    <div className="space-y-6">
      <div className="mb-6 pb-2 border-b">
        <h2 className="text-2xl font-semibold text-primary">Final Review & Submission</h2>
        <p className="text-sm text-foreground/60">Please review all information before submitting.</p>
      </div>

      <div className="p-6 bg-secondary/50 border-2 border-dashed border-border rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-foreground/50 uppercase tracking-widest">For Office Use Only</h3>
          <span className="text-xs bg-white px-2 py-1 rounded text-foreground/50 border">DO NOT FILL</span>
        </div>
        
        <p className="text-sm text-foreground/70 mb-6 italic">
          This section is preserved from the original application form for official processing. It will be completed by KPCC Industries Cell officials after submission.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-secondary/10 p-4 rounded-lg">
          <Input 
            label="Membership ID No:" 
            placeholder="For Official Use"
            {...register('membershipIdNo')}
          />
          <Input 
            label="Date of Admission:" 
            placeholder="DD / MM / YYYY"
            {...register('dateOfAdmission')}
          />
          <Input 
            label="Verified By (Name & Sign):" 
            placeholder="Official Use"
            {...register('verifiedBy')}
          />
          <Input 
            label="Approved By (Name & Sign):" 
            placeholder="Official Use"
            {...register('approvedBy')}
          />
        </div>
      </div>
      
      <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg flex items-start gap-3 text-orange-800">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <div>
          <h4 className="font-semibold">Ready to submit?</h4>
          <p className="text-sm mt-1">By clicking &quot;Submit Application&quot; below, your data will be securely transmitted to the KPCC Industries Cell administration team.</p>
        </div>
      </div>
    </div>
  );
}
