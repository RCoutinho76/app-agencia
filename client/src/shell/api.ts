import type {
  Cliente,
  Etapa,
  FinanceiroData,
  ProdutosData,
  RoteiroDetalhe,
  RoteiroResumo,
} from './types';

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(path);
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error((data && data.error) || 'Não foi possível carregar os dados.');
  }

  return data as T;
}

export function fetchClientes(): Promise<Cliente[]> {
  return getJson<Cliente[]>('/api/clientes');
}

export function fetchProdutos(): Promise<ProdutosData> {
  return getJson<ProdutosData>('/api/produtos');
}

export function fetchRoteiros(): Promise<RoteiroResumo[]> {
  return getJson<RoteiroResumo[]>('/api/roteiros');
}

export function fetchRoteiro(id: number): Promise<RoteiroDetalhe> {
  return getJson<RoteiroDetalhe>(`/api/roteiros/${id}`);
}

export function fetchFinanceiro(): Promise<FinanceiroData> {
  return getJson<FinanceiroData>('/api/financeiro');
}

function lerBase64(arquivo: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader();
    leitor.onload = () => {
      const resultado = String(leitor.result ?? '');
      resolve(resultado.includes(',') ? resultado.slice(resultado.indexOf(',') + 1) : '');
    };
    leitor.onerror = () => reject(new Error('Não foi possível ler o arquivo.'));
    leitor.readAsDataURL(arquivo);
  });
}

export async function enviarVoucher(etapaId: number, arquivo: File): Promise<Etapa> {
  const conteudo_base64 = await lerBase64(arquivo);
  const response = await fetch(`/api/etapas/${etapaId}/voucher`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome_arquivo: arquivo.name, conteudo_base64 }),
  });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error((data && data.error) || 'Não foi possível anexar o voucher.');
  }

  return data as Etapa;
}
