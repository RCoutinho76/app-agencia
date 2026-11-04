const dia = (v) => String(v).slice(0, 10);
const somarDias = (iso, n) => {
  const [a, m, d] = dia(iso).split('-').map(Number);
  return new Date(Date.UTC(a, m - 1, d + n)).toISOString().slice(0, 10);
};
const compacto = (iso) => iso.replaceAll('-', '');
export function gerarLinkGoogleCalendar(roteiro, cliente) {
  const inicio = compacto(dia(roteiro.data_ida));
  const fimExclusivo = compacto(somarDias(roteiro.data_volta, 1));
  const detalhes = [`Cliente: ${cliente.nome_completo}`, `Destino: ${roteiro.destino}`].join('\n');
  const params = new URLSearchParams({ action: 'TEMPLATE', text: `Viagem: ${roteiro.titulo}`, dates: `${inicio}/${fimExclusivo}`, details: detalhes, location: roteiro.destino });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
