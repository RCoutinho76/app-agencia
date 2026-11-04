import type { ReactNode } from 'react';

interface PageHeadProps {
  title: string;
  subtitle: string;
  actions?: ReactNode;
}

export default function PageHead({ title, subtitle, actions }: PageHeadProps) {
  return (
    <header className="sh-page-head">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {actions ? <div className="sh-page-head__actions">{actions}</div> : null}
    </header>
  );
}
