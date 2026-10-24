/**
 * Sistema de nota do Need or Greed.
 *
 * Dois eixos independentes:
 *  - Raridade: o quão bom é (derivada da nota 0 a 10).
 *  - Roll: se vale seu tempo e dinheiro agora (Need, Greed ou Pass).
 *
 * "Herança" fica fora da escala: as obras da vida, sem imparcialidade nenhuma.
 * Nomes e descrições ficam nos dicionários (src/i18n), aqui só a lógica.
 */

export type RaridadeId = 'lixo' | 'comum' | 'incomum' | 'raro' | 'epico' | 'lendario' | 'heranca';
export type RollId = 'need' | 'greed' | 'pass';

export interface Raridade {
  id: RaridadeId;
  /** Nota mínima para cair nesta raridade. */
  min: number;
}

export const RARIDADES: Raridade[] = [
  { id: 'lixo', min: 0 },
  { id: 'comum', min: 3 },
  { id: 'incomum', min: 5 },
  { id: 'raro', min: 7 },
  { id: 'epico', min: 9 },
  { id: 'lendario', min: 10 },
];

export const HERANCA: Raridade = { id: 'heranca', min: Infinity };

export const TODAS_RARIDADES: Raridade[] = [...RARIDADES, HERANCA];

export function raridadeDaNota(nota: number, heranca = false): Raridade {
  if (heranca) return HERANCA;
  let atual = RARIDADES[0];
  for (const r of RARIDADES) if (nota >= r.min) atual = r;
  return atual;
}

export function raridadePorId(id: string): Raridade | undefined {
  return TODAS_RARIDADES.find((r) => r.id === id);
}

export const ROLL_IDS: RollId[] = ['need', 'greed', 'pass'];

/**
 * O número do roll: a nota vezes dez, de 0 a 100. Nota 9.4 vira 94.
 * Cai sempre na mesma faixa da raridade (Raro 70 a 89, Épico 90 a 99, Lendário 100).
 */
export function valorDoRoll(nota: number): number {
  return Math.max(0, Math.min(100, Math.round(nota * 10)));
}

/** Nota com uma casa decimal, como aparece no item: 10 vira "10.0". */
export function notaFormatada(nota: number): string {
  return nota.toFixed(1);
}

export const TIPOS = {
  jogo: { secao: 'jogos' },
  filme: { secao: 'telas' },
  serie: { secao: 'telas' },
  anime: { secao: 'telas' },
} as const;

export type TipoId = keyof typeof TIPOS;
