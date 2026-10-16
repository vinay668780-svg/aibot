import { useState } from 'react';
import { Award, CheckCircle2, Download, ExternalLink, Loader2 } from 'lucide-react';

interface Props {
  certificateType?: string;
  processingTime?: string;
  fee?: string;
}

export function CertificateStepperWidget({
  certificateType = 'Bonafide Student Certificate',
  processingTime = 'Instant (Digital)',
  fee = '$0 (Complimentary)'
}: Props) {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [activeStep, setActiveStep] = useState(2);

  const steps = [
    { title: 'Enrollment Verification', desc: 'Active student status confirmed' },
    { title: 'Document Generation', desc: 'Cryptographic QR code applied' },
    { title: 'Registrar Seal & Issuance', desc: 'Ready for official download' }
  ];

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloaded(true);
      setActiveStep(3);
    }, 1200);
  };

  return (
    <div className="mt-3 p-3.5 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/30 rounded-xl">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 text-xs font-semibold uppercase tracking-wider">
          <Award className="w-3.5 h-3.5" />
          <span>{certificateType} Workflow</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400">
          <span>Fee: <strong className="text-zinc-800 dark:text-zinc-200">{fee}</strong></span>
          <span>•</span>
          <span>Time: <strong className="text-zinc-800 dark:text-zinc-200">{processingTime}</strong></span>
        </div>
      </div>

      <div className="space-y-2 my-2.5">
        {steps.map((s, idx) => {
          const isDone = idx < activeStep || downloaded;
          const isCurrent = idx === activeStep && !downloaded;
          return (
            <div key={s.title} className="flex items-start gap-2.5">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                isDone
                  ? 'bg-emerald-600 text-white'
                  : isCurrent
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-500'
                  : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400'
              }`}>
                {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
              </div>
              <div className="flex-1">
                <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 leading-snug">
                  {s.title}
                </div>
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  {s.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-emerald-500/20">
        <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
          Includes valid SHA-256 digital signature.
        </span>
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white transition-all cursor-pointer shadow-xs"
        >
          {downloading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Generating PDF...</span>
            </>
          ) : downloaded ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>PDF Downloaded</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              <span>Generate Official PDF</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
