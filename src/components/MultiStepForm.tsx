"use client";

import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronLeft, ChevronRight, Send } from 'lucide-react';
import { defaultFormData, FormData } from '@/lib/types';
import Step1Personal from './form-steps/Step1Personal';
import Step2Professional from './form-steps/Step2Professional';
import Step3Involvement from './form-steps/Step3Involvement';
import Step4Payment from './form-steps/Step4Payment';
import Step5Declaration from './form-steps/Step5Declaration';
import Step6OfficeUse from './form-steps/Step6OfficeUse';

const steps = [
  { id: 'personal', title: 'Personal Info' },
  { id: 'professional', title: 'Professional Details' },
  { id: 'involvement', title: 'Political Involvement' },
  { id: 'payment', title: 'Fee Details' },
  { id: 'declaration', title: 'Declaration' },
  { id: 'office', title: 'For Office Use' }
];

export default function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const methods = useForm<FormData>({
    defaultValues: defaultFormData,
    mode: 'onTouched'
  });

  const { handleSubmit, trigger } = methods;

  const handleNext = async () => {
    let fieldsToValidate: (keyof FormData)[] = [];
    
    // Step validation mapping based on the fields rendered in each step
    if (currentStep === 0) {
      fieldsToValidate = ['fullName', 'dob', 'mobile', 'email'];
    } else if (currentStep === 1) {
      fieldsToValidate = ['education', 'organization'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['isIncMember'];
    } else if (currentStep === 3) {
      fieldsToValidate = ['feeAmount', 'paymentMode'];
    } else if (currentStep === 4) {
      fieldsToValidate = ['signatureName'];
    }
    
    const isStepValid = await trigger(fieldsToValidate);
    
    if (isStepValid) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setSubmitSuccess(true);
      } else {
        setSubmitError(result.error || 'Failed to submit application. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setSubmitError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-3xl font-bold text-primary mb-4">Application Submitted Successfully</h2>
        <p className="text-foreground/70 max-w-md mx-auto mb-8">
          Thank you for applying to the KPCC Industries Cell. Your application has been received and will be reviewed shortly.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Progress Stepper */}
      <div className="mb-8 hidden md:block">
        <div className="flex justify-between items-center relative">
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-secondary -z-10" />
          <div 
            className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-ring transition-all duration-300 ease-in-out -z-10" 
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />
          
          {steps.map((step, idx) => (
            <div key={step.id} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors border-2 ${
                idx < currentStep ? 'bg-ring text-white border-ring' : 
                idx === currentStep ? 'bg-white text-ring border-ring' : 'bg-white text-foreground/40 border-border'
              }`}>
                {idx < currentStep ? <CheckCircle2 size={18} /> : idx + 1}
              </div>
              <span className={`text-xs mt-2 font-medium max-w-[80px] text-center ${
                idx <= currentStep ? 'text-primary' : 'text-foreground/40'
              }`}>{step.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile progress */}
      <div className="mb-6 md:hidden">
        <p className="text-sm font-medium text-ring mb-2">Step {currentStep + 1} of {steps.length}</p>
        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-ring transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
        <h2 className="text-xl font-bold mt-4">{steps[currentStep].title}</h2>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="py-4"
              >
                {currentStep === 0 && <Step1Personal />}
                {currentStep === 1 && <Step2Professional />}
                {currentStep === 2 && <Step3Involvement />}
                {currentStep === 3 && <Step4Payment />}
                {currentStep === 4 && <Step5Declaration />}
                {currentStep === 5 && <Step6OfficeUse />}
              </motion.div>
            </AnimatePresence>
          </div>

          {submitError && (
            <div className="p-4 mb-6 bg-red-50 text-red-600 border border-red-200 rounded-md">
              {submitError}
            </div>
          )}

          <div className="flex justify-between mt-8 pt-6 border-t border-border">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStep === 0 || isSubmitting}
              className={`flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-colors ${
                currentStep === 0 ? 'opacity-0 pointer-events-none' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              <ChevronLeft size={18} /> Previous
            </button>
            
            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors"
              >
                Next <ChevronRight size={18} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-3 bg-ring text-white font-bold rounded-md hover:bg-orange-600 transition-colors disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Submitting...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Submit Application <Send size={18} />
                  </span>
                )}
              </button>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
