export const brl = (valor: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor || 0);

const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

export function dataCurta(iso: string | null | undefined): string {
  if (!iso) return '—';
  const [, mes, dia] = iso.slice(0, 10).split('-').map(Number);
  return `${String(dia).padStart(2, '0')} ${meses[mes - 1]}`;
}

export function diaMes(iso: string): string {
  const [, mes, dia] = iso.slice(0, 10).split('-').map(Number);
  return `${String(dia).padStart(2, '0')}/${meses[mes - 1]}`;
}

export function dataLonga(iso: string | null | undefined): string {
  if (!iso) return '—';
  const [ano, mes, dia] = iso.slice(0, 10).split('-').map(Number);
  return new Date(ano, mes - 1, dia).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/);
  const primeira = partes[0]?.[0] ?? '';
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : '';
  return `${primeira}${ultima}`.toUpperCase();
}

export function situacaoValidade(iso: string | null | undefined): {
  label: string;
  vencido: boolean;
} {
  if (!iso) return { label: 'Não informado', vencido: false };
  const [ano, mes, dia] = iso.slice(0, 10).split('-').map(Number);
  const fim = new Date(ano, mes - 1, dia);
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const vencido = fim < hoje;
  return {
    label: vencido ? `Vencido em ${dataCurta(iso)}` : `Válido até ${dataCurta(iso)}`,
    vencido,
  };
}

export function dataHoje(): string {
  return new Date().toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: 'long',
  });
}
