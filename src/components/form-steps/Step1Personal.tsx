import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input, Select, FileUpload } from '../ui/FormControls';
import { FormData } from '@/lib/types';

export default function Step1Personal() {
  const { register, setValue, watch, formState: { errors } } = useFormContext<FormData>();

  const photoData = watch('photoData');
  const idProofData = watch('idProofData');

  return (
    <div className="space-y-6">
      <div className="mb-6 pb-2 border-b">
        <h2 className="text-2xl font-semibold text-primary">Personal Information</h2>
        <p className="text-sm text-foreground/60">Please provide your personal details as per official records.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input 
          label="01. Full Name (in block letters)" 
          placeholder="Enter full name" 
          required
          {...register('fullName', { required: 'Full name is required' })}
          error={errors.fullName?.message}
          className="uppercase"
        />

        <Input 
          label="02. Date of Birth" 
          type="date"
          required
          {...register('dob', { required: 'Date of birth is required' })}
          error={errors.dob?.message}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input 
            label="Age" 
            type="number"
            {...register('age')}
          />
          <Select 
            label="Gender" 
            options={[
              { label: 'Male', value: 'Male' },
              { label: 'Female', value: 'Female' },
              { label: 'Other', value: 'Other' }
            ]}
            {...register('gender')}
          />
        </div>

        <Input 
          label="03. Father's / Mother's Name" 
          placeholder="Enter parent's name"
          {...register('parentsName')}
        />

        <div className="md:col-span-2">
          <Input 
            label="04. Residential Address" 
            placeholder="Enter full residential address"
            {...register('residentialAddress')}
          />
        </div>

        <Input 
          label="05. District / Assembly Constituency" 
          placeholder="Enter district or constituency"
          {...register('district')}
        />

        <Input 
          label="Pin Code" 
          placeholder="e.g. 695010"
          {...register('pinCode')}
        />

        <Input 
          label="06. Contact Number (Mobile)" 
          type="tel"
          required
          {...register('mobile', { required: 'Mobile number is required' })}
          error={errors.mobile?.message}
        />

        <Input 
          label="WhatsApp Number" 
          type="tel"
          {...register('whatsapp')}
        />

        <Input 
          label="07. Email ID" 
          type="email"
          required
          {...register('email', { 
            required: 'Email is required',
            pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
          })}
          error={errors.email?.message}
        />

        <Select 
          label="Blood Group" 
          options={[
            { label: 'A+', value: 'A+' }, { label: 'A-', value: 'A-' },
            { label: 'B+', value: 'B+' }, { label: 'B-', value: 'B-' },
            { label: 'AB+', value: 'AB+' }, { label: 'AB-', value: 'AB-' },
            { label: 'O+', value: 'O+' }, { label: 'O-', value: 'O-' }
          ]}
          {...register('bloodGroup')}
        />
      </div>

      <div className="mt-8 pt-6 border-t">
        <h3 className="text-lg font-medium text-primary mb-4">08. Identity & Photo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Select 
              label="08. ID Proof Type" 
              options={[
                { label: 'Aadhaar', value: 'Aadhaar' },
                { label: 'Voter ID', value: 'Voter ID' },
                { label: 'Driving License', value: 'Driving License' }
              ]}
              {...register('idProofType')}
            />
            
            <Input 
              label="ID Proof No" 
              placeholder="Enter ID number"
              {...register('idProofNo')}
            />
            
            <FileUpload 
              label="(attach copy)" 
              accept="image/*,.pdf"
              preview={idProofData && idProofData.startsWith('data:image') ? idProofData : undefined}
              onChange={(base64) => setValue('idProofData', base64)}
            />
          </div>

          <div>
            <FileUpload 
              label="Affix Passport Size Photo Here" 
              accept="image/*"
              preview={photoData}
              onChange={(base64) => setValue('photoData', base64)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
