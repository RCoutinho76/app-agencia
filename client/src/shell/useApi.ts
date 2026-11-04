import { useCallback, useEffect, useState } from 'react';

export function useApi<T>(load: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let ativo = true;
    setLoading(true);
    setError(null);

    load()
      .then((resultado) => {
        if (!ativo) return;
        setData(resultado);
        setLoading(false);
      })
      .catch((erro: unknown) => {
        if (!ativo) return;
        setError(erro instanceof Error ? erro.message : 'Não foi possível carregar os dados.');
        setLoading(false);
      });

    return () => {
      ativo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  const reload = useCallback(() => setTick((valor) => valor + 1), []);

  return { data, error, loading, reload };
}
