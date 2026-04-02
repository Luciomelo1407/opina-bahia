import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Zap } from "lucide-react";
import { useMemo } from "react";

type SurveyHeroProps = {
  title: string;
  highlight: string;
  subtitle: string;
  trustLine: string;
  primaryCtaLabel: string;
  onPrimaryCta: () => void;
  totalQuestions?: number;
};

const SurveyHero = ({
  title,
  highlight,
  subtitle,
  trustLine,
  primaryCtaLabel,
  onPrimaryCta,
}: SurveyHeroProps) => {
  const trustLineWithoutTrailingPunctuation = trustLine.replace(/[.!?…]+$/, "");
  const liveCount = useMemo(() => Math.floor(Math.random() * 46) + 5, []);

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-survey-hero text-white">
      {/* Subtle backdrop layers */}
      <div className="pointer-events-none absolute inset-0">
        {/* Center glow */}
        <div className="absolute left-1/2 top-[28%] h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.35),transparent_60%)] blur-2xl" />
        {/* Secondary glow */}
        <div className="absolute left-[15%] top-[15%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.20),transparent_62%)] blur-2xl" />
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(0,0,0,0.55),transparent_55%)]" />
        {/* Ultra subtle noise */}
        <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(rgba(255,255,255,0.8)_1px,transparent_1px)] [background-size:18px_18px]" />
      </div>

      <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-2xl items-center justify-center px-4 py-10 sm:px-5 sm:py-12">
        <Card className="w-full border-white/10 bg-white/[0.04] p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_20px_80px_rgba(124,58,237,0.18)] backdrop-blur-xl sm:p-10">
          <div className="animate-survey-hero-in space-y-7">
            <div className="flex flex-col items-center gap-4 text-center">
              <Badge
                variant="secondary"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-1.5 text-[13px] font-medium text-white/85"
              >
                <Zap className="h-4 w-4 text-violet-300" />
                Enquete
              </Badge>

              <h1 className="text-balance text-[32px] font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
                <span className="text-white">Enquete 2026 </span>
                <span className="bg-gradient-to-r from-violet-300 via-violet-400 to-fuchsia-300 bg-clip-text text-transparent">
                  Bahia
                </span>
              </h1>

              <p className="max-w-xl text-pretty text-[15px] leading-relaxed text-white/75 sm:text-lg">
                Sua Voz Define o Futuro da Bahia
              </p>

              <div className="flex flex-col items-center gap-2">
                <p className="text-[13px] font-semibold text-white/60">
                  Mais de <span className="text-violet-300">3.247 baianos</span> já
                  responderam
                </p>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  <span className="text-[13px] font-medium text-emerald-300">
                    {liveCount} respondendo agora
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={onPrimaryCta}
                size="lg"
                className="group relative h-12 w-full scale-[0.99] rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-base font-bold text-white shadow-[0_10px_40px_rgba(124,58,237,0.35)] transition-all hover:shadow-[0_12px_55px_rgba(168,85,247,0.45)] focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B12] active:translate-y-[1px] sm:h-14"
              >
                <span className="absolute inset-0 -z-10 rounded-xl bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.22),transparent_45%)] opacity-60" />
                <span className="inline-flex items-center justify-center gap-2">
                  {primaryCtaLabel}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Button>

              <p className="text-center text-sm text-white/65">{trustLineWithoutTrailingPunctuation}</p>
              <p className="text-center text-xs text-white/40">Seus dados são confidenciais. Sem spam, sem cadastro.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SurveyHero;