interface ErrorBlockProps {
  message: string;
  onRetry: () => void;
}

export function LoadingBlock({ label = 'Carregando dados…' }: { label?: string }) {
  return (
    <div className="sh-state" role="status">
      <span className="sh-spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export function ErrorBlock({ message, onRetry }: ErrorBlockProps) {
  return (
    <div className="sh-state sh-state--error" role="alert">
      <span>{message}</span>
      <button type="button" className="sh-btn sh-btn--ghost" onClick={onRetry}>
        Tentar novamente
      </button>
    </div>
  );
}

export function EmptyBlock({ label }: { label: string }) {
  return <div className="sh-state sh-state--empty">{label}</div>;
}
