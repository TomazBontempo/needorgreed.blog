/**
 * Sistema de nota do Need or Greed.
 *
 * Dois eixos independentes:
 *  - Raridade: o quão bom é (derivada da nota 0 a 10).
 *  - Roll: se vale pegar (Need, Greed ou Pass).
 *
 * "Herança" fica fora da escala: as obras da vida, sem imparcialidade nenhuma.
 */

export type RaridadeId = 'lixo' | 'comum' | 'incomum' | 'raro' | 'epico' | 'lendario' | 'heranca';
export type RollId = 'need' | 'greed' | 'pass';

export interface Raridade {
  id: RaridadeId;
  nome: string;
  faixa: string;
  /** Nota mínima para cair nesta raridade. */
  min: number;
  /** Variável CSS com a cor da raridade (definida em global.css). */
  cor: string;
}

export const RARIDADES: Raridade[] = [
  { id: 'lixo', nome: 'Lixo de vendedor', faixa: '0 a 2.9', min: 0, cor: 'var(--r-lixo)' },
  { id: 'comum', nome: 'Comum', faixa: '3 a 4.9', min: 3, cor: 'var(--r-comum)' },
  { id: 'incomum', nome: 'Incomum', faixa: '5 a 6.9', min: 5, cor: 'var(--r-incomum)' },
  { id: 'raro', nome: 'Raro', faixa: '7 a 8.9', min: 7, cor: 'var(--r-raro)' },
  { id: 'epico', nome: 'Épico', faixa: '9 a 9.9', min: 9, cor: 'var(--r-epico)' },
  { id: 'lendario', nome: 'Lendário', faixa: '10', min: 10, cor: 'var(--r-lendario)' },
];

export const HERANCA: Raridade = {
  id: 'heranca',
  nome: 'Herança',
  faixa: 'fora da escala',
  min: Infinity,
  cor: 'var(--r-heranca)',
};

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

export const ROLLS: Record<RollId, { nome: string; descricao: string }> = {
  need: { nome: 'Need', descricao: 'Jogue ou assista agora.' },
  greed: { nome: 'Greed', descricao: 'Vale, mas espera promoção ou um tempo livre.' },
  pass: { nome: 'Pass', descricao: 'Deixa passar.' },
};

/** O número do dado (1 a 100) que aparece na mensagem de roll. Nota 9.4 vira 94. */
export function valorDoRoll(nota: number): number {
  return Math.max(1, Math.min(100, Math.round(nota * 10)));
}

export const TIPOS = {
  jogo: { nome: 'Jogo', secao: 'jogos' },
  filme: { nome: 'Filme', secao: 'telas' },
  serie: { nome: 'Série', secao: 'telas' },
  anime: { nome: 'Anime', secao: 'telas' },
} as const;

export type TipoId = keyof typeof TIPOS;
