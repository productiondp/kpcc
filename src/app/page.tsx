import Header from "@/components/Header";
import MultiStepForm from "@/components/MultiStepForm";
import { Mail, Phone } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-card shadow-xl rounded-xl border border-border overflow-hidden">
          <div className="p-6 md:p-8">
            <MultiStepForm />
          </div>
        </div>
      </main>

      <footer className="bg-primary text-primary-foreground/60 py-6 mt-12 text-sm text-center">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-center items-center gap-4">
          <p>© {new Date().getFullYear()} KPCC Industries Cell. All Rights Reserved.</p>
          <div className="flex gap-4">
            <span className="flex items-center gap-1"><Phone size={14} /> 0471-2721401</span>
            <span className="flex items-center gap-1"><Mail size={14} /> pcckerala@gmail.com</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
