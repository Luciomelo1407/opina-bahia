export function onlyDigits(s: string) {
  return (s ?? "").replace(/\D/g, "");
}

export function formatCep(cep: string) {
  const d = onlyDigits(cep).slice(0, 8);
  if (d.length <= 5) return d;
  return `${d.slice(0, 5)}-${d.slice(5)}`;
}

export function isValidCep(cep: string) {
  return /^\d{8}$/.test(onlyDigits(cep));
}

export type ViaCepResponse = {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string; // cidade
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
};

export async function fetchAddressByCep(cep: string, signal?: AbortSignal) {
  const digits = onlyDigits(cep);
  const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`, { signal });
  if (!res.ok) throw new Error("Falha ao consultar CEP");
  const data = (await res.json()) as ViaCepResponse;

  if (data.erro) throw new Error("CEP não encontrado");
  return data;
}