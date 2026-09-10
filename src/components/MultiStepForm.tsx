"use client";

import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Send, CheckCircle2, FileText, Download } from 'lucide-react';
import { defaultFormData, FormData } from '@/lib/types';
import Step1Personal from './form-steps/Step1Personal';
import Step2Professional from './form-steps/Step2Professional';
import Step3Involvement from './form-steps/Step3Involvement';
import Step4Payment from './form-steps/Step4Payment';
import Step5Declaration from './form-steps/Step5Declaration';
import ReviewStep from './form-steps/ReviewStep';
import ApplicationPDF from './ApplicationPDF';

const steps = [
  { id: 'personal', title: 'Personal Information' },
  { id: 'professional', title: 'Educational & Professional Details' },
  { id: 'involvement', title: 'Organizational / Political Involvement' },
  { id: 'payment', title: 'Membership Fee Details' },
  { id: 'declaration', title: 'Declaration' },
  { id: 'review', title: 'Review Application' }
];

export default function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [applicationNo, setApplicationNo] = useState('');

  const methods = useForm<FormData>({
    defaultValues: defaultFormData,
    mode: 'onTouched'
  });

  const { handleSubmit, trigger, getValues } = methods;

  const handleNext = async () => {
    let fieldsToValidate: (keyof FormData)[] = [];
    
    // Step validation mapping
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
    // If we are on the review step, actually submit
    if (currentStep < steps.length - 1) {
      handleNext();
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        setApplicationNo(result.applicationNo || 'KPCC-2026-PENDING');
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

  // Generate PDF manually using html2pdf
  const downloadPDF = async () => {
    const html2pdf = (await import('html2pdf.js')).default;
    const element = document.getElementById('pdf-content');
    if (!element) return;
    
    const opt = {
      margin:       10,
      filename:     `${applicationNo || 'Application'}.pdf`,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm' as const, format: 'a4', orientation: 'portrait' as const }
    };
    
    html2pdf().set(opt).from(element).save();
  };

  if (submitSuccess) {
    return (
      <div className="w-full flex-grow flex items-center justify-center p-4 bg-background">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-10 text-center">
          <div className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={48} strokeWidth={1.5} />
          </div>
          <h2 className="text-sm font-bold tracking-widest text-gray-500 uppercase mb-2">Application Submitted</h2>
          <p className="text-3xl font-bold text-primary mb-2">Thank You.</p>
          <p className="text-foreground/70 mb-8 max-w-md mx-auto">
            Your membership application has been successfully submitted and recorded.
          </p>
          
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-10">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Application Form No.</p>
            <p className="text-2xl font-bold text-primary tracking-tight">{applicationNo}</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3.5 border-2 border-gray-200 text-foreground font-semibold rounded-xl hover:bg-gray-50 transition-all w-full sm:w-auto"
            >
              Start New Application
            </button>
            <button 
              onClick={downloadPDF}
              className="flex items-center justify-center gap-2 px-8 py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-sm w-full sm:w-auto"
            >
              <Download size={18} /> Download PDF
            </button>
          </div>

          {/* Hidden PDF Content */}
          <div className="hidden">
            <div id="pdf-content">
              <ApplicationPDF data={getValues()} applicationNo={applicationNo} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col md:flex-row min-h-screen">
      
      {/* LEFT PANEL (Desktop) */}
      <div className="hidden md:flex flex-col w-[340px] lg:w-[400px] bg-primary text-white shrink-0 sticky top-0 h-screen overflow-y-auto p-10">
        <div className="mb-12">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="KPCC Logo" className="w-16 h-16 object-contain mb-6 bg-white rounded-full p-1" />
          <h1 className="text-2xl font-bold tracking-widest uppercase text-white/90 leading-tight">
            Membership<br />Application
          </h1>
          <p className="text-xs text-white/50 mt-4 uppercase tracking-widest font-semibold">KPCC Industries Cell</p>
        </div>

        <div className="flex-grow">
          <p className="text-[10px] font-bold tracking-widest text-accent uppercase mb-2">
            {currentStep + 1} / {steps.length}
          </p>
          <h2 className="text-xl font-semibold mb-8">{steps[currentStep].title}</h2>
          
          <div className="space-y-4">
            {steps.map((step, idx) => (
              <div key={step.id} className={`flex items-center gap-4 transition-all duration-300 ${idx === currentStep ? 'opacity-100' : 'opacity-40'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${idx === currentStep ? 'bg-accent' : 'bg-white'}`} />
                <span className={`text-sm font-medium ${idx === currentStep ? 'text-white' : 'text-white/80'}`}>{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-10 text-[10px] text-white/40 leading-relaxed uppercase tracking-wider">
          <p>Indira Bhavan, Vellayambalam</p>
          <p>Sasthamangalam P.O, Trivandrum</p>
          <p>Kerala, PIN: 695010</p>
        </div>
      </div>

      {/* TOP HEADER (Mobile) */}
      <div className="md:hidden bg-primary text-white sticky top-0 z-50">
        <div className="p-4 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="KPCC Logo" className="w-10 h-10 object-contain bg-white rounded-full p-0.5" />
          <div>
            <h1 className="text-sm font-bold tracking-widest uppercase">Membership Application</h1>
            <p className="text-[10px] text-white/70 uppercase tracking-wider">KPCC Industries Cell</p>
          </div>
        </div>
        <div className="bg-white/10 px-4 py-3 flex items-center justify-between">
          <span className="text-xs font-semibold text-accent uppercase tracking-widest">STEP {currentStep + 1} OF {steps.length}</span>
          <span className="text-xs text-white/80 font-medium">{steps[currentStep].title}</span>
        </div>
        <div className="w-full h-1 bg-white/10">
          <div 
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* RIGHT PANEL (Form Content) */}
      <div className="flex-1 flex flex-col bg-background">
        <div className="flex-grow p-6 md:p-12 lg:p-16 max-w-4xl mx-auto w-full">
          
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="min-h-[500px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {currentStep === 0 && <Step1Personal />}
                    {currentStep === 1 && <Step2Professional />}
                    {currentStep === 2 && <Step3Involvement />}
                    {currentStep === 3 && <Step4Payment />}
                    {currentStep === 4 && <Step5Declaration />}
                    {currentStep === 5 && <ReviewStep />}
                  </motion.div>
                </AnimatePresence>
              </div>

              {submitError && (
                <div className="p-4 mt-8 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-medium">
                  {submitError}
                </div>
              )}

              <div className="flex flex-col-reverse sm:flex-row justify-between mt-12 pt-8 border-t border-gray-200 gap-4">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentStep === 0 || isSubmitting}
                  className={`flex justify-center items-center gap-2 px-6 py-3.5 rounded-xl font-semibold transition-all w-full sm:w-auto ${
                    currentStep === 0 ? 'opacity-0 pointer-events-none hidden sm:flex' : 'bg-white border border-gray-200 text-foreground hover:bg-gray-50 hover:border-gray-300 shadow-sm'
                  }`}
                >
                  <ChevronLeft size={18} /> Back
                </button>
                
                {currentStep < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex justify-center items-center gap-2 px-8 py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-sm w-full sm:w-auto"
                  >
                    Continue <ChevronRight size={18} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex justify-center items-center gap-2 px-10 py-3.5 bg-accent text-white font-bold tracking-wide rounded-xl hover:bg-accent/90 transition-all shadow-md disabled:opacity-70 w-full sm:w-auto"
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
      </div>
    </div>
  );
}
