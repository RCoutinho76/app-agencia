import { ArrowIcon, StarIcon } from './icons';

const heroImage =
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1000&q=75';

const stats = [
  { value: '10 anos', label: 'acompanhando viajantes' },
  { value: '2.400+', label: 'viagens realizadas' },
  { value: '4,9/5', label: 'nota de quem voltou' },
];

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container hero__inner">
        <div className="hero__copy">
          <p className="eyebrow">Agência de viagens · desde 2015</p>
          <h1>Sua próxima viagem começa com uma boa conversa.</h1>
          <p className="hero__lead">
            Roteiros sob medida, hospedagens escolhidas a dedo e suporte de verdade antes, durante e
            depois da viagem — com a Carla e o Renato cuidando de cada detalhe.
          </p>

          <div className="hero__actions">
            <a className="btn btn--primary" href="#orcamento">
              Solicitar orçamento
              <ArrowIcon className="icon icon--arrow" />
            </a>
            <a className="btn btn--ghost" href="#destinos">
              Conhecer destinos
            </a>
          </div>

          <dl className="hero__stats">
            {stats.map((stat) => (
              <div key={stat.label} className="hero__stat">
                <dt>{stat.value}</dt>
                <dd>{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="hero__media">
          <img
            src={heroImage}
            alt="Lago entre montanhas ao amanhecer, visto de um mirante"
            width={1000}
            height={1250}
          />
          <figure className="hero__badge">
            <span className="hero__badge-label">Próxima saída</span>
            <strong>Grécia Clássica</strong>
            <span className="hero__badge-meta">10 dias · vagas em março</span>
            <span className="hero__badge-rating">
              <StarIcon className="icon icon--star" /> 4,9 · 68 viajantes
            </span>
          </figure>
        </div>
      </div>
    </section>
  );
}
