export interface RoteiroCalendar {
  titulo: string;
  destino: string;
  data_ida: string;
  data_volta: string;
}

export interface ClienteCalendar {
  nome_completo: string;
}

export function gerarLinkGoogleCalendar(
  roteiro: RoteiroCalendar,
  cliente: ClienteCalendar,
): string;
