import SectionHeading from './SectionHeading';
import type { Destination } from '../types';
import { brl } from '../utils';

interface DestinationsProps {
  items: Destination[];
  loading: boolean;
}

export default function Destinations({ items, loading }: DestinationsProps) {
  return (
    <section className="section" id="destinos">
      <div className="container">
        <SectionHeading
          eyebrow="Destinos"
          title="Lugares que a gente conhece de perto"
          description="Cada destino abaixo foi visitado pela nossa equipe. Escolha um ponto de partida e a gente monta o roteiro com você."
        />

        {loading ? (
          <div className="dest-grid" aria-hidden="true">
            {[0, 1, 2].map((item) => (
              <div className="dest-card dest-card--skeleton" key={item}>
                <div className="skeleton skeleton--media" />
                <div className="dest-card__body">
                  <div className="skeleton skeleton--line" />
                  <div className="skeleton skeleton--line skeleton--short" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="dest-grid">
            {items.map((destination) => (
              <article className="dest-card" key={destination.id}>
                <div className="dest-card__media">
                  <img
                    src={destination.image}
                    alt={`${destination.name}, ${destination.country}`}
                    loading="lazy"
                    width={900}
                    height={675}
                  />
                  <span className="tag">{destination.scope}</span>
                </div>
                <div className="dest-card__body">
                  <div className="dest-card__head">
                    <h3>{destination.name}</h3>
                    <span className="dest-card__country">{destination.country}</span>
                  </div>
                  <p className="dest-card__blurb">{destination.blurb}</p>
                  <div className="dest-card__foot">
                    <span className="price">
                      <small>a partir de</small>
                      {brl(destination.priceFrom)}
                    </span>
                    <span className="nights">{destination.nights} noites</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
