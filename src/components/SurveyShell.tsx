import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SurveyShellProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

const SurveyShell = ({ children, className, contentClassName }: SurveyShellProps) => {
  return (
    <div className={cn("relative min-h-[100dvh] overflow-hidden bg-survey-hero text-white", className)}>
      {/* Backdrop */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[18%] h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.32),transparent_60%)] blur-2xl" />
        <div className="absolute left-[12%] top-[10%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.18),transparent_62%)] blur-2xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.05),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(0,0,0,0.55),transparent_55%)]" />
        <div className="absolute inset-0 opacity-[0.05] [background-image:radial-gradient(rgba(255,255,255,0.8)_1px,transparent_1px)] [background-size:18px_18px]" />
      </div>

      <div className={cn("relative mx-auto flex min-h-[100dvh] w-full max-w-2xl flex-col px-5 py-6", contentClassName)}>
        {children}
      </div>
    </div>
  );
};

export default SurveyShell;