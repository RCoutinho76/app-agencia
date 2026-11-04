import { useState } from 'react';
import PageHead from '../PageHead';
import { EmptyBlock, ErrorBlock, LoadingBlock } from '../States';
import { fetchClientes } from '../api';
import { brl, dataLonga, iniciais, situacaoValidade } from '../format';
import { useApi } from '../useApi';
import type { Cliente } from '../types';

export default function CrmPanel() {
  const { data, error, loading, reload } = useApi(fetchClientes);
  const [selecionadoId, setSelecionadoId] = useState<number | null>(null);

  const clientes = data ?? [];
  const selecionado = clientes.find((cliente) => cliente.id === selecionadoId) ?? clientes[0] ?? null;

  return (
    <>
      <PageHead
        title="CRM Clientes"
        subtitle="Cadastro, documentos e histórico de compras de cada viajante."
        actions={<span className="sh-chip">{clientes.length} clientes</span>}
      />

      {loading ? <LoadingBlock label="Carregando clientes…" /> : null}
      {error && !loading ? <ErrorBlock message={error} onRetry={reload} /> : null}

      {!loading && !error ? (
        <div className="sh-split">
          <section className="sh-card sh-list" aria-label="Lista de clientes">
            <div className="sh-card__head">
              <h2>Clientes</h2>
              <span>{clientes.length}</span>
            </div>
            <div className="sh-list__scroll">
              {clientes.map((cliente) => (
                <button
                  key={cliente.id}
                  type="button"
                  className={`sh-client${cliente.id === selecionado?.id ? ' is-active' : ''}`}
                  onClick={() => setSelecionadoId(cliente.id)}
                >
                  <span className="sh-avatar sh-avatar--sm">{iniciais(cliente.nome_completo)}</span>
                  <span className="sh-client__body">
                    <strong>{cliente.nome_completo}</strong>
                    <span>{cliente.email}</span>
                  </span>
                  <span className="sh-client__count" title={`${cliente.roteiros} roteiros`}>
                    {cliente.roteiros}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {selecionado ? <DetalheCliente cliente={selecionado} /> : <EmptyBlock label="Nenhum cliente cadastrado ainda." />}
        </div>
      ) : null}
    </>
  );
}

function DetalheCliente({ cliente }: { cliente: Cliente }) {
  const passaporte = situacaoValidade(cliente.passaporte_validade);

  return (
    <article className="sh-detail">
      <div className="sh-detail__head">
        <span className="sh-avatar sh-avatar--lg">{iniciais(cliente.nome_completo)}</span>
        <div className="sh-detail__title">
          <h2>{cliente.nome_completo}</h2>
          <p>{cliente.email}</p>
        </div>
        <span className="sh-pill">
          {cliente.roteiros} {cliente.roteiros === 1 ? 'roteiro' : 'roteiros'}
        </span>
      </div>

      <div className="sh-detail__stats">
        <div>
          <span>Total comprado</span>
          <strong>{brl(cliente.total_compras)}</strong>
        </div>
        <div>
          <span>Roteiros na carteira</span>
          <strong>{cliente.roteiros}</strong>
        </div>
      </div>

      <dl className="sh-facts">
        <div>
          <dt>Nascimento</dt>
          <dd>{dataLonga(cliente.data_nascimento)}</dd>
        </div>
        <div>
          <dt>CPF</dt>
          <dd>{cliente.cpf ?? '—'}</dd>
        </div>
        <div>
          <dt>Celular</dt>
          <dd>{cliente.celular ?? '—'}</dd>
        </div>
        <div>
          <dt>E-mail</dt>
          <dd>{cliente.email ?? '—'}</dd>
        </div>
      </dl>

      <section className="sh-doc">
        <div>
          <h3>Passaporte</h3>
          <p>{cliente.passaporte_numero ?? 'Número não informado'}</p>
        </div>
        <span className={`sh-status${passaporte.vencido ? ' sh-status--warn' : ' sh-status--ok'}`}>
          {passaporte.label}
        </span>
      </section>

      <section className="sh-vistos">
        <h3>Vistos ativos</h3>
        {cliente.vistos.length > 0 ? (
          <ul>
            {cliente.vistos.map((visto) => (
              <li key={`${visto.pais}-${visto.validade}`}>
                <strong>{visto.pais}</strong>
                <span>{situacaoValidade(visto.validade).label}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="sh-muted">Nenhum visto cadastrado.</p>
        )}
      </section>

      {cliente.observacoes ? <p className="sh-note">{cliente.observacoes}</p> : null}
    </article>
  );
}
