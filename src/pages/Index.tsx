import { useCallback, useEffect, useRef, useState } from "react";
import { questions, Question } from "@/lib/quiz-data";
import QuizProgress from "@/components/QuizProgress";
import QuizStep from "@/components/QuizStep";
import SurveyHero from "@/components/SurveyHero";
import SurveyShell from "@/components/SurveyShell";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

function getUtmParams(): Record<string, string> {
  const params = new URLSearchParams(window.location.search);
  const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid"];
  const result: Record<string, string> = {};
  keys.forEach((k) => {
    result[k] = params.get(k) || "";
  });
  result.user_agent = navigator.userAgent;
  result.page_url = window.location.href;
  return result;
}

const ENDPOINT =
  "https://script.google.com/macros/s/AKfycbzHffjij5Wb788NYj4rrRfljjm77Qavwhb_PnmPNnDS7DgPttmd6rP8cVQ0a69CJAJy/exec";

const Index = () => {
  const [phase, setPhase] = useState<"hero" | "quiz" | "thanks">("hero");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const utmRef = useRef(getUtmParams());
  const submittedRef = useRef(false);

  const currentQ = questions[step];

  const validateAnswer = useCallback(
    (question: Question, value: any, allAnswers: Record<string, any>): string | null => {
      if (question.validate) {
        return question.validate(value, allAnswers);
      }
      if (question.type === "address") {
        if (!value) return "Esta pergunta é obrigatória.";
      } else {
        if (!(value || "").trim()) return "Esta pergunta é obrigatória.";
      }
      return null;
    },
    [],
  );

  const submit = async (finalAnswers: Record<string, any>) => {
    if (submittedRef.current || submitting) return;
    setSubmitting(true);
    setSubmitError(null);

    const addr = finalAnswers.endereco || {};

    // Payload com as chaves EXATAS que o seu script espera
    const payload = {
      nome_completo: finalAnswers.nome_completo || "",
      idade_faixa: finalAnswers.idade_faixa || "",
      telefone: finalAnswers.telefone || "",
      cidade: addr.cidade || "",
      bairro: addr.bairro || "",
      renda_mensal: finalAnswers.renda_mensal || "",
      voto_presidente_2026: finalAnswers.voto_presidente_2026 || "",
      voto_senador_1: finalAnswers.voto_senador_1_2026 || "",
      voto_senador_2: finalAnswers.voto_senador_2_2026 || "",
      voto_governador_ba_2026: finalAnswers.voto_governador_ba_2026 || "",
      dor_principal: finalAnswers.dor_principal || "",
      perfil_confianca: finalAnswers.perfil_confianca || "",
      mudaria_voto: finalAnswers.mudaria_voto || "",
      criterio_voto: finalAnswers.criterio_voto || "",
      
      // Dados extras (opcional, seu script vai ignorar se não mapear)
      ...utmRef.current,
      timestamp: new Date().toISOString(),
    };

    try {
      // Enviamos como POST usando mode: 'no-cors'
      // O corpo é a string JSON. O seu script vai receber isso em e.postData.contents
      await fetch(ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain", // Importante: text/plain evita o bloqueio de CORS
        },
        body: JSON.stringify(payload),
      });

      // Como no-cors não permite ler a resposta, assumimos sucesso se não houver erro de rede
      submittedRef.current = true;
      if (typeof window.fbq === "function") {
        window.fbq("track", "Lead", { content_name: "Enquete 2026 Bahia" });
      }
      setPhase("thanks");
    } catch (e) {
      console.warn("[survey] submission failed", e);
      setSubmitError("Falha ao enviar. Verifique sua conexão e tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const next = useCallback(() => {
    const validationError = validateAnswer(currentQ, answers[currentQ.id], answers);
    if (validationError) {
      setError(validationError);
      return;
    }

    let nextStep = step + 1;
    while (nextStep < questions.length) {
      const q = questions[nextStep];
      if (!q.showIf || q.showIf(answers)) {
        break;
      }
      nextStep++;
    }

    if (nextStep < questions.length) {
      setStep(nextStep);
      setError(null);
    } else {
      submit(answers);
    }
  }, [step, answers, currentQ, validateAnswer]);

  const back = useCallback(() => {
    let prevStep = step - 1;
    while (prevStep >= 0) {
      const q = questions[prevStep];
      if (!q.showIf || q.showIf(answers)) {
        break;
      }
      prevStep--;
    }

    if (prevStep >= 0) {
      setStep(prevStep);
      setError(null);
    }
  }, [step, answers]);

  const setAnswer = useCallback((val: any) => {
    setAnswers((prev) => ({ ...prev, [currentQ.id]: val }));
  }, [currentQ.id]);

  useEffect(() => {
    if (error) {
      const validationError = validateAnswer(currentQ, answers[currentQ.id], answers);
      setError(validationError);
    }
  }, [answers, currentQ, error, validateAnswer]);

  if (phase === "hero") {
    return (
      <SurveyHero
        title="Enquete 2026"
        highlight="Bahia"
        subtitle="Sua Voz Define o Futuro da Bahia"
        trustLine="Anônimo. Gratuito. Leva menos de 1 minuto."
        primaryCtaLabel="Dar Minha Opinião"
        onPrimaryCta={() => setPhase("quiz")}
        totalQuestions={questions.length}
      />
    );
  }

  if (phase === "thanks") {
    return (
      <SurveyShell contentClassName="justify-center px-4 py-6 sm:px-5 sm:py-8">
        <div className="mx-auto w-full max-w-lg">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_20px_80px_rgba(124,58,237,0.18)] backdrop-blur-xl sm:p-7">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/[0.06]">
              <CheckCircle2 className="h-7 w-7 text-violet-300" />
            </div>

            <h1 className="mt-4 text-2xl font-extrabold text-white sm:text-[28px]">Resposta registrada</h1>
            <p className="mt-2 text-sm text-white/70 sm:text-base">Obrigado por participar.</p>
          </div>
        </div>
      </SurveyShell>
    );
  }

  const isLast = step === questions.length - 1;

  return (
    <SurveyShell contentClassName="px-4 py-4 sm:px-5 sm:py-8">
      <header className="sticky top-0 z-10 -mx-4 border-b border-white/10 bg-[#0B0B12]/70 px-4 py-3 backdrop-blur-xl sm:-mx-5 sm:px-5">
        <QuizProgress current={step + 1} total={questions.length} />
      </header>

      <main className="flex flex-1 flex-col pt-5 sm:pt-7">
        <div className="mx-auto w-full max-w-lg flex-1">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] backdrop-blur-xl sm:p-7">
            <QuizStep
              key={currentQ.id}
              question={currentQ}
              value={answers[currentQ.id]}
              onChange={setAnswer}
              error={error}
            />
          </div>
        </div>

        {submitError && <p className="mt-4 text-center text-sm font-medium text-red-300">{submitError}</p>}

        <div className="mx-auto mt-5 w-full max-w-lg">
          <div className="grid grid-cols-1 gap-3 sm:flex sm:gap-3">
            {step > 0 && (
              <Button
                type="button"
                onClick={back}
                variant="secondary"
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.06] text-white hover:bg-white/[0.09] sm:w-auto"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
            )}

            <Button
              type="button"
              onClick={next}
              disabled={submitting}
              className="group relative h-12 w-full flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-base font-bold text-white shadow-[0_10px_40px_rgba(124,58,237,0.35)] transition-all hover:shadow-[0_12px_55px_rgba(168,85,247,0.45)] focus-visible:ring-2 focus-visible:ring-violet-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B12] active:translate-y-[1px]"
            >
              <span className="absolute inset-0 -z-10 rounded-xl bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.22),transparent_45%)] opacity-60" />
              {submitting ? "Enviando…" : isLast ? "Enviar respostas" : "Próxima"}
            </Button>
          </div>
        </div>
      </main>
    </SurveyShell>
  );
};

export default Index;