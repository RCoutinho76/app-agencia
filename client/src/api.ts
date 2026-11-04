import type { Catalog, QuotePayload } from './types';

export class ApiError extends Error {
  status: number;
  fields: Record<string, string>;

  constructor(status: number, message: string, fields: Record<string, string> = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fields = fields;
  }
}

async function readJson<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      response.status,
      (data && data.error) || 'Não foi possível concluir a solicitação.',
      (data && data.errors) || {},
    );
  }

  return data as T;
}

export function fetchCatalog(): Promise<Catalog> {
  return fetch('/api/catalog').then(readJson<Catalog>);
}

export function createQuote(payload: QuotePayload): Promise<{ id: number; createdAt: string }> {
  return fetch('/api/quotes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then(readJson<{ id: number; createdAt: string }>);
}
