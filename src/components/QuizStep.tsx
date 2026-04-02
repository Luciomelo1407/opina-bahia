import { Question } from "@/lib/quiz-data";
import { ChevronDown, Check, Search } from "lucide-react";
import { useState, useEffect, useMemo, useRef } from "react";
import bahiaLocations from "@/lib/bahia-locations.json";

interface QuizStepProps {
  question: Question;
  value: any;
  onChange: (value: any) => void;
  error: string | null;
}

type CandidateCardOption = {
  value: string;
  label: string;
  image: string;
};

const DEP_FEDERAL_CARDS: CandidateCardOption[] = [
  { value: "Jornalista Susane Vidal", label: "Jornalista Susane Vidal", image: "/susane.jpg" },
  { value: "Yandra de André", label: "Yandra de André", image: "/yandra.jpg" },
  { value: "ícaro de Valmir", label: "ícaro de Valmir", image: "/icaro.jpg" },
  { value: "André davi", label: "André davi", image: "/andre.jpeg" },
  { value: "Fábio Reis", label: "Fábio Reis", image: "/fabio.jpg" },
  { value: "Gustinho Ribeiro", label: "Gustinho Ribeiro", image: "/gustinho.jpg" },
  { value: "Ricardo Marques", label: "Ricardo Marques", image: "/ricardo.jpg" },
  { value: "katarina Feitosa", label: "katarina Feitosa", image: "/katarina.jpg" },
  { value: "Jõao Daniel", label: "Jõao Daniel", image: "/joaod.jpg" },
  { value: "Thiago de Joaldo", label: "Thiago de Joaldo", image: "/thiago.jpeg" },
  { value: "Moana Valares", label: "Moana Valares", image: "/moana.jpg" },
];

const DEP_ESTADUAL_CARDS: CandidateCardOption[] = [
  { value: "Jornalista Susane Vidal", label: "Jornalista Susane Vidal", image: "/susane.jpg" },
  { value: "Maisa Mitidieri", label: "Maisa Mitidieri", image: "/maisa.jpg" },
  { value: "Luizão Dona Trampi", label: "Luizão Dona Trampi", image: "/luizao.jpg" },
  { value: "Linda Brasil", label: "Linda Brasil", image: "/linda.jpg" },
  { value: "Luciano Bispo", label: "Luciano Bispo", image: "/luciano.jpg" },
  { value: "Jorginho Araujo", label: "Jorginho Araujo", image: "/jorginho.jpg" },
  { value: "Profª. Melissa Rolemberg", label: "Profª. Melissa Rolemberg", image: "/melissa.jpg" },
  { value: "Georgeo Passos", label: "Georgeo Passos", image: "/georgeo.jpg" },
  { value: "Lucio Flávio", label: "Lucio Flávio", image: "/lucio.jpg" },
  { value: "Kitty Lima", label: "Kitty Lima", image: "/kitty.jpg" },
  { value: "Delegada Danielle Garcia", label: "Delegada Danielle Garcia", image: "/danielle.jpg" },
];

const QuizStep = ({ question, value, onChange, error }: QuizStepProps) => {
  const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-center text-white placeholder:text-white/45 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur-md transition-all focus:outline-none focus:ring-2 focus:ring-violet-400/70 focus:ring-offset-2 focus:ring-offset-[#0B0B12]";

  const predefinedValues = useMemo(() => {
    if (question.type !== "radio" || !question.options) return [];
    return question.options.filter((o) => o.value !== "outro").map((o) => o.value);
  }, [question]);

  const isDepFederalCardsStep = question.id === "ja_tem_dep_federal_nome";
  const isDepEstadualCardsStep = question.id === "ja_tem_dep_estadual_nome";

  const isCustomValue = useMemo(() => {
    if (!value) return false;
    if (value === "outro") return false;

    if (isDepFederalCardsStep) {
      return !DEP_FEDERAL_CARDS.some((c) => c.value === value);
    }

    if (isDepEstadualCardsStep) {
      return !DEP_ESTADUAL_CARDS.some((c) => c.value === value);
    }

    return !predefinedValues.includes(value);
  }, [isDepFederalCardsStep, isDepEstadualCardsStep, predefinedValues, value]);

  return (
    <div className="w-full animate-fade-in space-y-4 sm:space-y-5">
      <h2 className="text-center text-lg font-semibold leading-snug text-white sm:text-xl">{question.label}</h2>

      {question.type === "text" && (
        <input
          type="text"
          className={inputClass}
          placeholder={question.placeholder}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          autoFocus
        />
      )}

      {question.type === "tel" && (
        <input
          type="tel"
          inputMode="numeric"
          className={inputClass}
          placeholder={question.placeholder}
          value={value || ""}
          onChange={(e) => {
            const digits = e.target.value.replace(/\D/g, "").slice(0, 11);
            let masked = "";
            if (digits.length > 0) masked += "(" + digits.slice(0, 2);
            if (digits.length >= 2) masked += ") ";
            if (digits.length > 2 && digits.length <= 7) masked += digits.slice(2);
            else if (digits.length > 7) masked += digits.slice(2, 7) + "-" + digits.slice(7);
            onChange(masked);
          }}
          autoFocus
        />
      )}

      {question.type === "select" && (
        <div className="relative">
          <select
            className="w-full appearance-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 pr-10 text-center text-white shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur-md transition-all focus:outline-none focus:ring-2 focus:ring-violet-400/70 focus:ring-offset-2 focus:ring-offset-[#0B0B12]"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
          >
            <option value="" className="text-black">
              Selecione sua cidade
            </option>
            {question.options!.map((opt) => (
              <option key={opt.value} value={opt.value} className="text-black">
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/55" />
        </div>
      )}

      {question.type === "radio" && isDepFederalCardsStep && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
            {DEP_FEDERAL_CARDS.map((opt) => {
              const selected = value === opt.value;

              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChange(opt.value)}
                  className={[
                    "group relative flex flex-col overflow-hidden rounded-xl border transition-all duration-200 text-center",
                    "shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur-md text-center",
                    selected
                      ? "border-violet-400/60 ring-2 ring-violet-400/40 bg-violet-400/10"
                      : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B12]",
                  ].join(" ")}
                >
                  <div className="aspect-[3/4] w-full overflow-hidden bg-white/5">
                    <img
                      src={opt.image}
                      alt={opt.label}
                      onError={(e) => {
                        console.warn("[survey] image failed to load:", opt.image);
                        (e.currentTarget as HTMLImageElement).src = "/placeholder.svg";
                      }}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div
                    className={[
                      "flex items-center justify-center min-h-[3rem] p-2.5 text-center text-xs font-bold leading-tight sm:text-sm sm:min-h-[3.5rem]",
                      selected ? "bg-violet-400 text-white" : "bg-black/40 text-white/90",
                    ].join(" ")}
                  >
                    {opt.label}
                  </div>
                </button>
              );
            })}

            <div className="col-span-2 sm:col-span-3">
              <button
                type="button"
                onClick={() => onChange("outro")}
                className={[
                  "w-full rounded-xl border text-left px-4 py-3.5 text-base font-medium transition-all duration-150",
                  "shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur-md",
                  value === "outro" || isCustomValue
                    ? "border-violet-400/40 bg-[linear-gradient(90deg,rgba(124,58,237,0.20),rgba(168,85,247,0.14))] text-white"
                    : "border-white/10 bg-white/[0.03] text-white/90 hover:bg-white/[0.05]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B12]",
                ].join(" ")}
              >
                Outros:
              </button>

              {(value === "outro" || isCustomValue) && (
                <div className="animate-fade-in pt-2">
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="Digite o nome do candidato"
                    value={isCustomValue ? value : ""}
                    onChange={(e) => onChange(e.target.value || "outro")}
                    autoFocus
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {question.type === "radio" && isDepEstadualCardsStep && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
            {DEP_ESTADUAL_CARDS.map((opt) => {
              const selected = value === opt.value;

              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChange(opt.value)}
                  className={[
                    "group relative flex flex-col overflow-hidden rounded-xl border transition-all duration-200",
                    "shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur-md",
                    selected
                      ? "border-violet-400/60 ring-2 ring-violet-400/40 bg-violet-400/10"
                      : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B12]",
                  ].join(" ")}
                >
                  <div className="aspect-[3/4] w-full overflow-hidden bg-white/5">
                    <img
                      src={opt.image}
                      alt={opt.label}
                      onError={(e) => {
                        console.warn("[survey] image failed to load:", opt.image);
                        (e.currentTarget as HTMLImageElement).src = "/placeholder.svg";
                      }}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div
                    className={[
                      "flex items-center justify-center min-h-[3rem] p-2.5 text-center text-xs font-bold leading-tight sm:text-sm sm:min-h-[3.5rem]",
                      selected ? "bg-violet-400 text-white" : "bg-black/40 text-white/90",
                    ].join(" ")}
                  >
                    {opt.label}
                  </div>
                </button>
              );
            })}

            <div className="col-span-2 sm:col-span-3">
              <button
                type="button"
                onClick={() => onChange("outro")}
                className={[
                  "w-full rounded-xl border text-left px-4 py-3.5 text-base font-medium transition-all duration-150",
                  "shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur-md",
                  value === "outro" || isCustomValue
                    ? "border-violet-400/40 bg-[linear-gradient(90deg,rgba(124,58,237,0.20),rgba(168,85,247,0.14))] text-white"
                    : "border-white/10 bg-white/[0.03] text-white/90 hover:bg-white/[0.05]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B12]",
                ].join(" ")}
              >
                Outro:
              </button>

              {(value === "outro" || isCustomValue) && (
                <div className="animate-fade-in pt-2">
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="Digite o nome do candidato"
                    value={isCustomValue ? value : ""}
                    onChange={(e) => onChange(e.target.value || "outro")}
                    autoFocus
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {question.type === "radio" && !isDepFederalCardsStep && !isDepEstadualCardsStep && (
        <div className="space-y-2.5">
          {question.options!.map((opt) => {
            const isOutro = opt.value === "outro";
            const selected = isOutro ? isCustomValue || value === "outro" : value === opt.value;

            return (
              <div key={opt.value} className="space-y-2">
                <button
                  type="button"
                  onClick={() => onChange(isOutro ? "outro" : opt.value)}
                  className={[
                    "w-full rounded-xl border text-center px-4 py-3.5 text-base font-medium transition-all duration-150",
                    "shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur-md",
                    selected
                      ? "border-violet-400/40 bg-[linear-gradient(90deg,rgba(124,58,237,0.20),rgba(168,85,247,0.14))] text-white"
                      : "border-white/10 bg-white/[0.03] text-white/90 hover:bg-white/[0.05]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B12]",
                  ].join(" ")}
                >
                  {opt.label}
                </button>

                {isOutro && selected && (
                  <div className="animate-fade-in pt-1">
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="Digite o nome do candidato"
                      value={isCustomValue ? value : ""}
                      onChange={(e) => onChange(e.target.value || "outro")}
                      autoFocus
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {question.type === "address" && <LocationForm value={value} onChange={onChange} inputClass={inputClass} />}

      {error && <p className="text-sm font-medium text-red-300">{error}</p>}
    </div>
  );
};

const cities = Object.keys(bahiaLocations as Record<string, string[]>).sort();

interface ComboboxProps {
  options: string[];
  value: string;
  onSelect: (val: string) => void;
  placeholder: string;
  searchPlaceholder: string;
  disabled?: boolean;
  inputClass: string;
  autoFocus?: boolean;
}

const Combobox = ({ options, value, onSelect, placeholder, searchPlaceholder, disabled, inputClass, autoFocus }: ComboboxProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(
    () => options.filter((o) => o.toLowerCase().includes(search.toLowerCase())),
    [options, search]
  );

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50);
    else setSearch("");
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        autoFocus={autoFocus}
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
        className={`${inputClass} flex items-center justify-between text-left ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"} ${!value ? "text-white/45" : ""}`}
      >
        <span className="truncate">{value || placeholder}</span>
        <ChevronDown className={`ml-2 h-4 w-4 shrink-0 text-white/60 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-white/10 bg-[#13131f] shadow-xl overflow-hidden">
          <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2.5">
            <Search className="h-4 w-4 shrink-0 text-white/40" />
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full bg-transparent text-sm text-white placeholder:text-white/40 outline-none"
            />
          </div>
          <ul className="max-h-56 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-white/40">Nenhum resultado.</li>
            ) : (
              filtered.map((opt) => (
                <li
                  key={opt}
                  onClick={() => { onSelect(opt); setOpen(false); }}
                  className={`flex items-center justify-between px-3 py-2 text-sm cursor-pointer transition-colors hover:bg-white/10 ${opt === value ? "text-violet-300" : "text-white"}`}
                >
                  {opt}
                  {opt === value && <Check className="h-3.5 w-3.5 text-violet-300" />}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

const LocationForm = ({ value, onChange, inputClass }: any) => {
  const [cidade, setCidade] = useState<string>(value?.cidade || "");
  const [bairro, setBairro] = useState<string>(() => {
    if (!value?.bairro) return "";
    const list = value.cidade ? (bahiaLocations as Record<string, string[]>)[value.cidade] ?? [] : [];
    return list.includes(value.bairro) ? value.bairro : "Outro";
  });
  const [customBairro, setCustomBairro] = useState<string>(() => {
    if (!value?.bairro) return "";
    const list = value.cidade ? (bahiaLocations as Record<string, string[]>)[value.cidade] ?? [] : [];
    return list.includes(value.bairro) ? "" : value.bairro;
  });

  const bairros = useMemo<string[]>(() => {
    if (!cidade) return [];
    const list = (bahiaLocations as Record<string, string[]>)[cidade] ?? [];
    return [...list, "Outro"];
  }, [cidade]);

  const handleCidadeSelect = (val: string) => {
    setCidade(val);
    setBairro("");
    setCustomBairro("");
  };

  useEffect(() => {
    onChange({ 
      cidade, 
      bairro: bairro === "Outro" ? customBairro : bairro 
    });
  }, [cidade, bairro, customBairro, onChange]);

  return (
    <div className="space-y-3">
      <div>
        <label className="mb-1.5 block text-md font-medium text-white/80">Cidade</label>
        <Combobox
          options={cities}
          value={cidade}
          onSelect={handleCidadeSelect}
          placeholder="Selecione a cidade..."
          searchPlaceholder="Buscar cidade..."
          inputClass={inputClass}
          autoFocus
        />
      </div>

      {cidade && (
        <div className="animate-fade-in space-y-3">
          <div>
            <label className="mb-1.5 block text-md font-medium text-white/80">Bairro</label>
            <Combobox
              options={bairros}
              value={bairro}
              onSelect={setBairro}
              placeholder="Selecione o bairro..."
              searchPlaceholder="Buscar bairro..."
              inputClass={inputClass}
            />
          </div>
          {bairro === "Outro" && (
            <div className="animate-fade-in">
              <input
                type="text"
                className={inputClass}
                placeholder="Digite o nome do seu bairro"
                value={customBairro}
                onChange={(e) => setCustomBairro(e.target.value)}
                autoFocus
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizStep;
