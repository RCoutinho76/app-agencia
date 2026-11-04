import PageHead from '../PageHead';
import { ErrorBlock, LoadingBlock } from '../States';
import { fetchFinanceiro } from '../api';
import { brl, dataCurta } from '../format';
import { useApi } from '../useApi';

export default function FinanceiroPanel() {
  const { data, error, loading, reload } = useApi(fetchFinanceiro);

  const resumo = data?.resumo;
  const lancamentos = data?.lancamentos ?? [];

  return (
    <>
      <PageHead
        title="Módulo Financeiro"
        subtitle="Lançamentos de venda, comissões e contratos fechados por cliente."
        actions={<span className="sh-chip">{lancamentos.length} lançamentos</span>}
      />

      {loading ? <LoadingBlock label="Carregando lançamentos…" /> : null}
      {error && !loading ? <ErrorBlock message={error} onRetry={reload} /> : null}

      {resumo ? (
        <>
          <section className="sh-stats" aria-label="Resumo financeiro">
            <article className="sh-stat">
              <span>Faturamento bruto</span>
              <strong>{brl(resumo.faturamento_bruto)}</strong>
            </article>
            <article className="sh-stat">
              <span>Comissões líquidas</span>
              <strong>{brl(resumo.comissoes_liquidas)}</strong>
            </article>
            <article className="sh-stat">
              <span>Contratos fechados</span>
              <strong>{resumo.contratos}</strong>
            </article>
            <article className="sh-stat">
              <span>Ticket médio</span>
              <strong>{brl(resumo.ticket_medio)}</strong>
            </article>
          </section>

          <section className="sh-card">
            <div className="sh-card__head">
              <h2>Lançamentos</h2>
              <span>Ordenados pela data de venda</span>
            </div>
            <div className="sh-table-wrap">
              <table className="sh-table">
                <thead>
                  <tr>
                    <th scope="col">Data</th>
                    <th scope="col">Cliente</th>
                    <th scope="col">Item comprado</th>
                    <th scope="col">Categoria</th>
                    <th scope="col" className="sh-num">Venda</th>
                    <th scope="col" className="sh-num">Comissão</th>
                    <th scope="col">Contrato</th>
                  </tr>
                </thead>
                <tbody>
                  {lancamentos.map((lancamento) => (
                    <tr key={lancamento.id}>
                      <td className="sh-nowrap">{dataCurta(lancamento.data_venda)}</td>
                      <td>{lancamento.cliente_nome}</td>
                      <td>
                        <strong>{lancamento.item_comprado}</strong>
                      </td>
                      <td>
                        <span className="sh-tag">{lancamento.categoria_nome}</span>
                      </td>
                      <td className="sh-num">{brl(lancamento.valor_total_venda)}</td>
                      <td className="sh-num sh-num--gold">{brl(lancamento.comissao_liquida)}</td>
                      <td>
                        <span
                          className={`sh-status${lancamento.contrato_fechado ? ' sh-status--ok' : ' sh-status--warn'}`}
                        >
                          {lancamento.contrato_fechado ? 'Fechado' : 'Em negociação'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : null}
    </>
  );
}
