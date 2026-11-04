import SectionHeading from './SectionHeading';
import { CheckIcon } from './icons';
import type { TravelPackage } from '../types';
import { brl } from '../utils';

export default function Packages({ items }: { items: TravelPackage[] }) {
  if (items.length === 0) return null;

  return (
    <section className="section section--tinted" id="pacotes">
      <div className="container">
        <SectionHeading
          eyebrow="Pacotes"
          title="Roteiros prontos, ajustados ao seu jeito"
          description="Base pronta para embarcar — e flexível no que importa: datas, hospedagem e passeios."
        />

        <div className="packages">
          {items.map((travelPackage) => (
            <article className="package" key={travelPackage.id}>
              <div className="package__media">
                <img
                  src={travelPackage.image}
                  alt={`Roteiro ${travelPackage.name}`}
                  loading="lazy"
                  width={1200}
                  height={800}
                />
                <span className="package__days">{travelPackage.days} dias</span>
              </div>

              <div className="package__body">
                <h3>{travelPackage.name}</h3>
                <p className="package__summary">{travelPackage.summary}</p>

                <ul className="package__includes">
                  {travelPackage.includes.map((item) => (
                    <li key={item}>
                      <CheckIcon className="icon icon--check" />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="package__foot">
                  <span className="price">
                    <small>por pessoa</small>
                    {brl(travelPackage.price)}
                  </span>
                  <a className="btn btn--ghost btn--sm" href="#orcamento">
                    Quero este roteiro
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
