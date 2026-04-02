export type QuestionType = "text" | "tel" | "radio" | "select" | "address";

export interface QuestionOption {
  value: string;
  label: string;
}

export interface Question {
  id: string;
  label: string;
  type: QuestionType;
  options?: QuestionOption[];
  placeholder?: string;
  minLength?: number;
  showIf?: (allAnswers: Record<string, any>) => boolean;
  validate?: (value: any, allAnswers?: Record<string, any>) => string | null;
}

const isSequential = (digits: string): boolean => {
  if (digits.length < 10) return false;
  let inc = true;
  let dec = true;
  for (let i = 1; i < digits.length; i++) {
    const prev = Number(digits[i - 1]);
    const cur = Number(digits[i]);
    if (cur !== (prev + 1) % 10) inc = false;
    if (cur !== (prev + 9) % 10) dec = false;
    if (!inc && !dec) return false;
  }
  return inc || dec;
};

const isRepeatedPattern = (str: string): boolean => {
  const s = str.toLowerCase().replace(/\s/g, "");
  if (s.length < 4) return false;
  for (let size = 1; size <= Math.floor(s.length / 2); size++) {
    const pattern = s.slice(0, size);
    if (s.length % size === 0 && pattern.repeat(s.length / size) === s) return true;
  }
  return false;
};

const isAllSameDigit = (digits: string): boolean => /^(\d)\1+$/.test(digits);

const phoneValidate = (v: string): string | null => {
  const digits = v.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 11) return "Informe DDD + número (10 ou 11 dígitos).";
  const numberPart = digits.slice(2);
  if (isAllSameDigit(digits) || isAllSameDigit(numberPart)) return "Informe um número de telefone válido.";
  if (isSequential(digits) || isSequential(numberPart)) return "Informe um número de telefone válido.";
  if (isRepeatedPattern(digits) || isRepeatedPattern(numberPart)) return "Informe um número de telefone válido.";
  return null;
};

const nameValidate = (v: string): string | null => {
  const name = (v || "").trim();
  if (name.length < 6) return "Mínimo de 6 caracteres.";
  if (/\d/.test(name)) return "O nome não deve conter números.";
  if (!name.includes(" ")) return "Por favor, insira seu nome completo.";
  return null;
};

export const questions: Question[] = [
  {
    id: "idade_faixa",
    label: "Qual sua idade?",
    type: "radio",
    options: [
      { value: "18 a 24 anos", label: "18 a 24 anos" },
      { value: "25 a 34 anos", label: "25 a 34 anos" },
      { value: "35 a 44 anos", label: "35 a 44 anos" },
      { value: "45 a 54 anos", label: "45 a 54 anos" },
      { value: "Mais de 55", label: "Mais de 55" },
    ],
  },
  {
    id: "renda_mensal",
    label: "Qual é a sua renda mensal aproximada?",
    type: "radio",
    options: [
      { value: "Até 1 salário mínimo", label: "Até 1 salário mínimo" },
      { value: "De 2 a 5 salários mínimos", label: "De 2 a 5 salários mínimos" },
      { value: "De 5 a 10 salários mínimos", label: "De 5 a 10 salários mínimos" },
      { value: "Acima de 10 salários mínimos", label: "Acima de 10 salários mínimos" },
    ],
  },
  {
    id: "dor_principal",
    label: "Qual desses problemas mais afeta diretamente a sua vida hoje?",
    type: "radio",
    options: [
      { value: "Demora para conseguir atendimento de saúde", label: "Demora para conseguir atendimento de saúde" },
      { value: "Medo de violência", label: "Medo de violência" },
      { value: "Falta de emprego", label: "Falta de emprego" },
      { value: "Preço alto das coisas (custo de vida)", label: "Preço alto das coisas (custo de vida)" },
      { value: "Problemas no seu bairro (buraco, iluminação, transporte)", label: "Problemas no seu bairro (buraco, iluminação, transporte)" },
    ],
  },
  {
    id: "perfil_confianca",
    label: "Qual tipo de político você mais confia para votar?",
    type: "radio",
    options: [
      { value: "Quem resolve problemas na prática", label: "Quem resolve problemas na prática" },
      { value: "Quem ajuda diretamente as pessoas", label: "Quem ajuda diretamente as pessoas" },
      { value: "Quem tem boas ideias e projetos", label: "Quem tem boas ideias e projetos" },
      { value: "Quem fala bem e representa o povo", label: "Quem fala bem e representa o povo" },
      { value: "Quem já tem experiência política", label: "Quem já tem experiência política" },
      { value: "Quem é novo e quer mudar tudo", label: "Quem é novo e quer mudar tudo" },
    ],
  },
  {
    id: "criterio_voto",
    label: "Na hora de decidir seu voto, o que realmente faz a diferença pra você?",
    type: "radio",
    options: [
      { value: "Indicação de amigos/família", label: "Indicação de amigos/família" },
      { value: "Atuação na região", label: "Atuação na região" },
      { value: "Lideranças locais", label: "Lideranças locais" },
      { value: "Partido político", label: "Partido político" },
    ],
  },
  {
    id: "voto_presidente_2026",
    label: "Se a eleição para Presidente fosse hoje, em quem você votaria?",
    type: "radio",
    options: [
      { value: "Lula (PT)", label: "Lula (PT)" },
      { value: "Flávio Bolsonaro (PL)", label: "Flávio Bolsonaro (PL)" },
      { value: "Romeu Zema (NOVO)", label: "Romeu Zema (NOVO)" },
      { value: "Ronaldo Caiado (PSD)", label: "Ronaldo Caiado (PSD)" },
      { value: "Renan Santos (Missão)", label: "Renan Santos (Missão)" },
      { value: "Não sei", label: "Não sei" },
      { value: "Branco / Nulo", label: "Branco / Nulo" },
    ],
  },
  {
    id: "mudaria_voto",
    label: "Você mudaria seu voto até o dia da eleição?",
    type: "radio",
    options: [
      { value: "Sim", label: "Sim" },
      { value: "Não", label: "Não" },
    ],
  },
  {
    id: "voto_governador_ba_2026",
    label: "Quem você votaria para Governador da Bahia?",
    type: "radio",
    options: [
      { value: "Jerônimo Rodrigues (PT)", label: "Jerônimo Rodrigues (PT)" },
      { value: "ACM Neto (União)", label: "ACM Neto (União)" },
      { value: "Não sei / Indeciso", label: "Não sei / Indeciso" },
      { value: "Branco / Nulo", label: "Branco / Nulo" },
    ],
  },
  {
    id: "voto_senador_1_2026",
    label: "Quem você votaria para Senado (1ª vaga)?",
    type: "radio",
    options: [
      { value: "Jaques Wagner (PT)", label: "Jaques Wagner (PT)" },
      { value: "Rui Costa (PT)", label: "Rui Costa (PT)" },
      { value: "Angelo Coronel (Republicanos)", label: "Angelo Coronel (Republicanos)" },
      { value: "Aroldo Cedraz (sem partido)", label: "Aroldo Cedraz (sem partido)" },
      { value: "Ronaldo Carletto (Avante)", label: "Ronaldo Carletto (Avante)" },
      { value: "João Roma (PL)", label: "João Roma (PL)" },
      { value: "Não sei / Indeciso", label: "Não sei / Indeciso" },
      { value: "Branco / Nulo", label: "Branco / Nulo" },
    ],
  },
  {
    id: "voto_senador_2_2026",
    label: "Quem você votaria para Senado (2ª vaga)?",
    type: "radio",
    options: [
      { value: "Jaques Wagner (PT)", label: "Jaques Wagner (PT)" },
      { value: "Rui Costa (PT)", label: "Rui Costa (PT)" },
      { value: "Angelo Coronel (Republicanos)", label: "Angelo Coronel (Republicanos)" },
      { value: "Aroldo Cedraz (sem partido)", label: "Aroldo Cedraz (sem partido)" },
      { value: "Ronaldo Carletto (Avante)", label: "Ronaldo Carletto (Avante)" },
      { value: "João Roma (PL)", label: "João Roma (PL)" },
      { value: "Não sei / Indeciso", label: "Não sei / Indeciso" },
      { value: "Branco / Nulo", label: "Branco / Nulo" },
    ],
    validate: (value, allAnswers) => {
      if (!value) return "Esta pergunta é obrigatória.";
      if (allAnswers && value === allAnswers["voto_senador_1_2026"]) {
        return "Por favor, escolha um senador diferente para a segunda vaga.";
      }
      return null;
    },
  },
  {
    id: "nome_completo",
    label: "Qual seu nome completo?",
    type: "text",
    placeholder: "Digite seu nome completo",
    validate: (v) => nameValidate(v),
  },
  {
    id: "telefone",
    label: "Seu WhatsApp (com DDD)",
    type: "tel",
    placeholder: "(71) 99999-9999",
    validate: (v) => phoneValidate(v),
  },
  {
    id: "endereco",
    label: "Onde você mora?",
    type: "address",
    validate: (v: any) => {
      if (!v?.cidade) return "Por favor, selecione sua cidade.";
      if (!v?.bairro) return "Por favor, selecione seu bairro.";
      return null;
    },
  },
];