import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input, Select, FileUpload } from '../ui/FormControls';
import { FormData } from '@/lib/types';
import { useState, useEffect } from 'react';

const KERALA_DISTRICTS = [
  { label: 'Thiruvananthapuram', value: 'Thiruvananthapuram' },
  { label: 'Kollam', value: 'Kollam' },
  { label: 'Pathanamthitta', value: 'Pathanamthitta' },
  { label: 'Alappuzha', value: 'Alappuzha' },
  { label: 'Kottayam', value: 'Kottayam' },
  { label: 'Idukki', value: 'Idukki' },
  { label: 'Ernakulam', value: 'Ernakulam' },
  { label: 'Thrissur', value: 'Thrissur' },
  { label: 'Palakkad', value: 'Palakkad' },
  { label: 'Malappuram', value: 'Malappuram' },
  { label: 'Kozhikode', value: 'Kozhikode' },
  { label: 'Wayanad', value: 'Wayanad' },
  { label: 'Kannur', value: 'Kannur' },
  { label: 'Kasaragod', value: 'Kasaragod' }
];

export default function Step1Personal() {
  const { register, setValue, watch, formState: { errors } } = useFormContext<FormData>();

  const photoData = watch('photoData');
  const idProofData = watch('idProofData');
  const currentDistrictCombined = watch('district') || '';

  const [selectedDist, setSelectedDist] = useState('');
  const [selectedConst, setSelectedConst] = useState('');

  // Initialize from combined value if present (e.g. going back to step 1)
  useEffect(() => {
    if (currentDistrictCombined && !selectedDist && !selectedConst) {
      if (currentDistrictCombined.includes(' - ')) {
        const parts = currentDistrictCombined.split(' - ');
        setSelectedDist(parts[0]);
        setSelectedConst(parts[1]);
      } else {
        setSelectedConst(currentDistrictCombined);
      }
    }
  }, [currentDistrictCombined, selectedDist, selectedConst]);

  // Update form value when either changes
  useEffect(() => {
    if (selectedDist || selectedConst) {
      const combined = [selectedDist, selectedConst].filter(Boolean).join(' - ');
      setValue('district', combined, { shouldValidate: true });
    } else {
      setValue('district', '');
    }
  }, [selectedDist, selectedConst, setValue]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-primary mb-2">Personal Information</h2>
        <p className="text-sm text-foreground/60">Please provide your personal details as per official records.</p>
      </div>

      {/* Photo Upload at the top */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="flex-grow">
          <h3 className="text-lg font-bold text-primary mb-1">Passport Size Photo</h3>
          <p className="text-sm text-foreground/60 mb-4">Affix Passport Size Photo Here. This will be printed on your official membership card.</p>
          <FileUpload 
            label="Upload Photo" 
            accept="image/*"
            preview={photoData}
            onChange={(base64) => setValue('photoData', base64)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
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
          <Input 
            label="Gender" 
            placeholder="e.g. Male/Female"
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

        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
          <div className="md:col-span-2">
            <h4 className="text-sm font-semibold text-primary mb-1">05. District / Assembly Constituency</h4>
            <p className="text-xs text-foreground/60 mb-2">Select your district and enter your constituency.</p>
          </div>
          
          <Select 
            label="District" 
            options={KERALA_DISTRICTS}
            value={selectedDist}
            onChange={(e) => setSelectedDist(e.target.value)}
          />
          
          <Input 
            label="Assembly Constituency" 
            placeholder="e.g. Nemom"
            value={selectedConst}
            onChange={(e) => setSelectedConst(e.target.value)}
          />
        </div>

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

      <div className="mt-8 pt-8 border-t border-gray-200">
        <h3 className="text-xl font-bold text-primary mb-6">08. Identity Proof</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Select 
              label="ID Proof Type" 
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
          </div>

          <div>
            <FileUpload 
              label="(attach copy)" 
              accept="image/*,.pdf"
              preview={idProofData && idProofData.startsWith('data:image') ? idProofData : undefined}
              onChange={(base64) => setValue('idProofData', base64)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
