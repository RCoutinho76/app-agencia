import { useRef, useState } from 'react';
import type { ChangeEvent, ComponentType } from 'react';
import PageHead from '../PageHead';
import { EmptyBlock, ErrorBlock, LoadingBlock } from '../States';
import { enviarVoucher, fetchRoteiro, fetchRoteiros } from '../api';
import { brl, dataCurta, dataLonga, diaMes, iniciais } from '../format';
import { useApi } from '../useApi';
import { gerarLinkGoogleCalendar } from '../../lib/googleCalendar';
import {
  CalendarIcon,
  CarIcon,
  CheckIcon,
  ClockIcon,
  ExternalIcon,
  FileIcon,
  FoodIcon,
  HotelIcon,
  PaperclipIcon,
  PinIcon,
  PlaneIcon,
  RouteIcon,
} from '../icons';
import type { Etapa, EtapaTipo, RoteiroDetalhe, RoteiroStatus } from '../types';

const statusRoteiro: Record<RoteiroStatus, string> = {
  rascunho: 'Rascunho',
  enviado: 'Enviado',
  aprovado: 'Aprovado',
  cancelado: 'Cancelado',
};

interface TipoInfo {
  label: string;
  icon: ComponentType<{ className?: string }>;
}

const tipos: Record<EtapaTipo, TipoInfo> = {
  voo: { label: 'Voo', icon: PlaneIcon },
  hotel: { label: 'Hotel', icon: HotelIcon },
  carro: { label: 'Carro', icon: CarIcon },
  passeio: { label: 'Passeio', icon: PinIcon },
  refeicao: { label: 'Refeição', icon: FoodIcon },
  traslado: { label: 'Traslado', icon: RouteIcon },
  outro: { label: 'Outro', icon: FileIcon },
};

export default function RoteirosPanel() {
  const { data, error, loading, reload } = useApi(fetchRoteiros);
  const [selecionadoId, setSelecionadoId] = useState<number | null>(null);

  const roteiros = data ?? [];
  const ativo = roteiros.find((roteiro) => roteiro.id === selecionadoId) ?? roteiros[0] ?? null;
  const detalhe = useApi<RoteiroDetalhe | null>(
    () => (ativo ? fetchRoteiro(ativo.id) : Promise.resolve(null)),
    [ativo?.id],
  );

  return (
    <>
      <PageHead
        title="Roteiros & Propostas"
        subtitle="Linha do tempo da viagem, vouchers anexados e envio do roteiro para o calendário."
        actions={<span className="sh-chip">{roteiros.length} propostas</span>}
      />

      {loading ? <LoadingBlock label="Carregando propostas…" /> : null}
      {error && !loading ? <ErrorBlock message={error} onRetry={reload} /> : null}

      {!loading && !error ? (
        <div className="sh-split sh-split--roteiros">
          <section className="sh-card sh-list sh-list--trips" aria-label="Propostas de roteiro">
            <div className="sh-card__head">
              <h2>Propostas</h2>
              <span>{roteiros.length}</span>
            </div>
            <div className="sh-list__scroll">
              {roteiros.map((roteiro) => (
                <button
                  key={roteiro.id}
                  type="button"
                  className={`sh-trip-item${roteiro.id === ativo?.id ? ' is-active' : ''}`}
                  onClick={() => setSelecionadoId(roteiro.id)}
                >
                  <span className={`sh-trip-item__mark sh-trip-item__mark--${roteiro.status}`} aria-hidden="true" />
                  <span className="sh-trip-item__body">
                    <strong>{roteiro.titulo}</strong>
                    <span>{roteiro.cliente_nome}</span>
                    <span className="sh-trip-item__meta">
                      {dataCurta(roteiro.data_ida)} – {dataCurta(roteiro.data_volta)} · {roteiro.etapas} etapas
                    </span>
                  </span>
                  <span className={`sh-status sh-status--${roteiro.status}`}>
                    {statusRoteiro[roteiro.status]}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <div className="sh-trip-detail">
            {detalhe.loading ? <LoadingBlock label="Montando a linha do tempo…" /> : null}
            {detalhe.error && !detalhe.loading ? (
              <ErrorBlock message={detalhe.error} onRetry={detalhe.reload} />
            ) : null}
            {detalhe.data && !detalhe.loading ? (
              <TripDetail
                detalhe={detalhe.data}
                onVoucherEnviado={() => {
                  detalhe.reload();
                  reload();
                }}
              />
            ) : null}
            {!detalhe.data && !detalhe.loading && !detalhe.error ? (
              <EmptyBlock label="Selecione uma proposta para ver a linha do tempo." />
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}

function TripDetail({
  detalhe,
  onVoucherEnviado,
}: {
  detalhe: RoteiroDetalhe;
  onVoucherEnviado: () => void;
}) {
  const { roteiro, cliente, etapas } = detalhe;
  const grupos = agruparPorDia(etapas);

  return (
    <>
      <article className="sh-trip-hero">
        <div className="sh-trip-hero__top">
          <span className={`sh-status sh-status--${roteiro.status}`}>
            {statusRoteiro[roteiro.status]}
          </span>
          <span className="sh-trip-hero__period">
            {dataCurta(roteiro.data_ida)} — {dataLonga(roteiro.data_volta)}
          </span>
        </div>

        <div className="sh-trip-hero__main">
          <div>
            <h2>{roteiro.titulo}</h2>
            <p className="sh-trip-hero__destino">
              <PinIcon />
              {roteiro.destino}
            </p>
          </div>
          <div className="sh-trip-hero__value">
            <span>Valor da proposta</span>
            <strong>{brl(roteiro.valor_total)}</strong>
          </div>
        </div>

        <div className="sh-trip-hero__foot">
          <span className="sh-person">
            <span className="sh-avatar sh-avatar--sm">{iniciais(cliente.nome_completo)}</span>
            <span>
              <strong>{cliente.nome_completo}</strong>
              <small>{cliente.celular ?? cliente.email}</small>
            </span>
          </span>

          <button
            type="button"
            className="sh-btn sh-btn--light"
            onClick={() => window.open(gerarLinkGoogleCalendar(roteiro, cliente), '_blank')}
          >
            <CalendarIcon />
            Agendar no Google Calendar
          </button>
        </div>
      </article>

      <section className="sh-card sh-card--timeline">
        <div className="sh-card__head">
          <h2>Linha do tempo do roteiro</h2>
          <span>
            {etapas.length} etapas · {grupos.length} dias
          </span>
        </div>

        {roteiro.observacoes_cliente ? (
          <p className="sh-note sh-note--soft">{roteiro.observacoes_cliente}</p>
        ) : null}

        <ol className="sh-timeline">
          {grupos.map((grupo) => (
            <li key={grupo.dia} className="sh-day">
              <span className="sh-day__badge">
                <span>Dia {grupo.dia}</span>
                <small>{diaMes(grupo.data)}</small>
              </span>
              <div className="sh-day__items">
                {grupo.etapas.map((etapa) => (
                  <EtapaCard key={etapa.id} etapa={etapa} onVoucherEnviado={onVoucherEnviado} />
                ))}
              </div>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}

function EtapaCard({ etapa, onVoucherEnviado }: { etapa: Etapa; onVoucherEnviado: () => void }) {
  const info = tipos[etapa.tipo] ?? tipos.outro;
  const Icone = info.icon;

  return (
    <article className={`sh-stage sh-stage--${etapa.tipo}`}>
      <div className="sh-stage__head">
        <span className={`sh-stage__type sh-stage__type--${etapa.tipo}`}>
          <Icone />
          {info.label}
        </span>
        {etapa.horario ? (
          <span className="sh-stage__time">
            <ClockIcon />
            {etapa.horario}
          </span>
        ) : null}
      </div>

      <h3>{etapa.titulo}</h3>
      {etapa.descricao ? <p>{etapa.descricao}</p> : null}

      {etapa.voucher_codigo ? (
        <p className="sh-stage__code">
          Código do voucher: <strong>{etapa.voucher_codigo}</strong>
        </p>
      ) : null}

      <VoucherArea etapa={etapa} onVoucherEnviado={onVoucherEnviado} />
    </article>
  );
}

function VoucherArea({ etapa, onVoucherEnviado }: { etapa: Etapa; onVoucherEnviado: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function selecionarArquivo(event: ChangeEvent<HTMLInputElement>) {
    const arquivo = event.target.files?.[0];
    if (!arquivo) return;

    setErro(null);

    if (arquivo.size > 10 * 1024 * 1024) {
      setErro('O arquivo deve ter no máximo 10 MB.');
      event.target.value = '';
      return;
    }

    setEnviando(true);
    try {
      await enviarVoucher(etapa.id, arquivo);
      onVoucherEnviado();
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : 'Não foi possível anexar o voucher.');
    } finally {
      setEnviando(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div className={`sh-voucher${etapa.voucher_url ? ' sh-voucher--anexado' : ''}`}>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.png,.jpg,.jpeg,.webp"
        className="sh-voucher__input"
        aria-label={`Anexar voucher de ${etapa.titulo}`}
        onChange={selecionarArquivo}
      />

      <span className="sh-voucher__icon">{etapa.voucher_url ? <CheckIcon /> : <PaperclipIcon />}</span>

      <div className="sh-voucher__text">
        <strong>{etapa.voucher_url ? 'Voucher anexado' : 'Espaço para voucher'}</strong>
        <span>
          {etapa.voucher_url ? 'Arquivo disponível para envio ao cliente' : 'PDF, PNG, JPG ou WEBP até 10 MB'}
        </span>
        {erro ? (
          <span className="sh-voucher__error" role="alert">
            {erro}
          </span>
        ) : null}
      </div>

      <div className="sh-voucher__actions">
        {etapa.voucher_url ? (
          <a className="sh-voucher__link" href={etapa.voucher_url} target="_blank" rel="noreferrer">
            Abrir
            <ExternalIcon />
          </a>
        ) : null}
        <button
          type="button"
          className="sh-voucher__btn"
          disabled={enviando}
          onClick={() => inputRef.current?.click()}
        >
          {enviando ? 'Enviando…' : etapa.voucher_url ? 'Substituir' : 'Anexar'}
        </button>
      </div>
    </div>
  );
}

function agruparPorDia(etapas: Etapa[]) {
  const grupos = new Map<number, { dia: number; data: string; etapas: Etapa[] }>();

  for (const etapa of etapas) {
    const grupo = grupos.get(etapa.dia_numero);
    if (grupo) {
      grupo.etapas.push(etapa);
    } else {
      grupos.set(etapa.dia_numero, {
        dia: etapa.dia_numero,
        data: etapa.data,
        etapas: [etapa],
      });
    }
  }

  return [...grupos.values()].sort((a, b) => a.dia - b.dia);
}
