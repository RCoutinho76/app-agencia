import { CompassIcon } from './icons';

export default function Brand({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  return (
    <span className={`brand brand--${tone}`}>
      <CompassIcon className="brand__mark" />
      <span className="brand__text">
        <strong>Por Aí</strong>
        <span>Turismo</span>
      </span>
    </span>
  );
}
