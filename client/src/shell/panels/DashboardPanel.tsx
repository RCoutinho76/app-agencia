import PageHead from '../PageHead';
import { ErrorBlock, LoadingBlock } from '../States';
import { fetchFinanceiro } from '../api';
import { brl, dataCurta, iniciais } from '../format';
import { useApi } from '../useApi';
import { ShieldIcon, TrendIcon, WalletIcon } from '../icons';

export default function DashboardPanel() {
  const { data, error, loading, reload } = useApi(fetchFinanceiro);

  const resumo = data?.resumo;
  const porCategoria = data?.por_categoria ?? [];
  const lancamentos = data?.lancamentos ?? [];
  const maiorComissao = Math.max(...porCategoria.map((item) => item.comissoes), 1);
  const margem =
    resumo && resumo.faturamento_bruto > 0
      ? (resumo.comissoes_liquidas / resumo.faturamento_bruto) * 100
      : 0;

  return (
    <>
      <PageHead
        title="Dashboard de Gestão"
        subtitle="Faturamento e comissões consolidados a partir dos lançamentos financeiros da agência."
        actions={
          <span className="sh-chip sh-chip--admin">
            <ShieldIcon />
            Somente admin
          </span>
        }
      />

      {loading ? <LoadingBlock label="Somando lançamentos financeiros…" /> : null}
      {error && !loading ? <ErrorBlock message={error} onRetry={reload} /> : null}

      {resumo ? (
        <>
          <section className="sh-kpis" aria-label="Indicadores financeiros">
            <article className="sh-kpi sh-kpi--navy">
              <div className="sh-kpi__head">
                <span className="sh-kpi__label">Faturamento bruto</span>
                <span className="sh-kpi__icon">
                  <TrendIcon />
                </span>
              </div>
              <strong className="sh-kpi__value">{brl(resumo.faturamento_bruto)}</strong>
              <p className="sh-kpi__hint">
                {resumo.contratos} lançamentos · LancamentoFinanceiro
              </p>
            </article>

            <article className="sh-kpi sh-kpi--gold">
              <div className="sh-kpi__head">
                <span className="sh-kpi__label">Comissões líquidas</span>
                <span className="sh-kpi__icon">
                  <WalletIcon />
                </span>
              </div>
              <strong className="sh-kpi__value">{brl(resumo.comissoes_liquidas)}</strong>
              <p className="sh-kpi__hint">{margem.toFixed(1)}% de margem sobre o faturamento</p>
            </article>
          </section>

          <section className="sh-minis" aria-label="Resumo complementar">
            <div className="sh-mini">
              <span>Ticket médio</span>
              <strong>{brl(resumo.ticket_medio)}</strong>
            </div>
            <div className="sh-mini">
              <span>Contratos fechados</span>
              <strong>{resumo.contratos}</strong>
            </div>
            <div className="sh-mini">
              <span>Comissão média</span>
              <strong>{brl(resumo.comissoes_liquidas / Math.max(resumo.contratos, 1))}</strong>
            </div>
          </section>

          <div className="sh-dash-grid">
            <section className="sh-card">
              <div className="sh-card__head">
                <h2>Comissões por categoria</h2>
                <span>Comissão líquida</span>
              </div>
              <ul className="sh-bars">
                {porCategoria.map((item) => (
                  <li key={item.categoria}>
                    <div className="sh-bars__top">
                      <span>{item.categoria}</span>
                      <strong>{brl(item.comissoes)}</strong>
                    </div>
                    <div className="sh-bars__track">
                      <span
                        style={{
                          width: `${Math.max(6, (item.comissoes / maiorComissao) * 100)}%`,
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="sh-card">
              <div className="sh-card__head">
                <h2>Últimos lançamentos</h2>
                <span>{lancamentos.length} no total</span>
              </div>
              <ul className="sh-recent">
                {lancamentos.slice(0, 5).map((item) => (
                  <li key={item.id}>
                    <span className="sh-avatar sh-avatar--sm">{iniciais(item.cliente_nome)}</span>
                    <span className="sh-recent__body">
                      <strong>{item.item_comprado}</strong>
                      <span>
                        {item.cliente_nome} · {dataCurta(item.data_venda)}
                      </span>
                    </span>
                    <span className="sh-recent__amount">
                      {brl(item.valor_total_venda)}
                      <small>com. {brl(item.comissao_liquida)}</small>
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </>
      ) : null}
    </>
  );
}
