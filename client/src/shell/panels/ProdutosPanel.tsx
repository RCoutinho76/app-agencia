import type { ComponentType } from 'react';
import PageHead from '../PageHead';
import { ErrorBlock, LoadingBlock } from '../States';
import { fetchProdutos } from '../api';
import { useApi } from '../useApi';
import { BoxIcon, CarIcon, HotelIcon, PlaneIcon } from '../icons';
import type { CategoriaProduto } from '../types';

const icones: Record<CategoriaProduto['icone'], ComponentType<{ className?: string }>> = {
  Plane: PlaneIcon,
  Hotel: HotelIcon,
  Car: CarIcon,
  Package: BoxIcon,
};

export default function ProdutosPanel() {
  const { data, error, loading, reload } = useApi(fetchProdutos);

  const categorias = data?.categorias ?? [];
  const itens = data?.itens ?? [];

  return (
    <>
      <PageHead
        title="Produtos"
        subtitle="Catálogo de categorias, itens e fornecedores parceiros da agência."
        actions={<span className="sh-chip">{itens.length} itens ativos</span>}
      />

      {loading ? <LoadingBlock label="Carregando catálogo…" /> : null}
      {error && !loading ? <ErrorBlock message={error} onRetry={reload} /> : null}

      {!loading && !error ? (
        <>
          <section className="sh-cats" aria-label="Categorias de produto">
            {categorias.map((categoria) => {
              const Icone = icones[categoria.icone] ?? BoxIcon;
              return (
                <article key={categoria.id} className="sh-cat">
                  <span className="sh-cat__icon">
                    <Icone />
                  </span>
                  <div className="sh-cat__body">
                    <h2>{categoria.nome}</h2>
                    <p>{categoria.descricao}</p>
                  </div>
                  <span className="sh-cat__count">
                    {categoria.itens} {categoria.itens === 1 ? 'item' : 'itens'}
                  </span>
                </article>
              );
            })}
          </section>

          <section className="sh-card">
            <div className="sh-card__head">
              <h2>Itens cadastrados</h2>
              <span>{itens.length} no catálogo</span>
            </div>
            <div className="sh-table-wrap">
              <table className="sh-table">
                <thead>
                  <tr>
                    <th scope="col">Produto</th>
                    <th scope="col">Fornecedor</th>
                    <th scope="col">Categoria</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {itens.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <strong>{item.nome}</strong>
                        {item.descricao ? <span className="sh-cell-note">{item.descricao}</span> : null}
                      </td>
                      <td>{item.fornecedor ?? '—'}</td>
                      <td>
                        <span className="sh-tag">{item.categoria_nome}</span>
                      </td>
                      <td>
                        <span className={`sh-status${item.ativo ? ' sh-status--ok' : ' sh-status--warn'}`}>
                          {item.ativo ? 'Ativo' : 'Inativo'}
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
