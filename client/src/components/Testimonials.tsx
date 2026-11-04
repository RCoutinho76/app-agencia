import SectionHeading from './SectionHeading';
import type { Testimonial } from '../types';

function initials(name: string): string {
  return name
    .split(' ')
    .filter((part) => part.length > 2)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export default function Testimonials({ items }: { items: Testimonial[] }) {
  if (items.length === 0) return null;

  return (
    <section className="section section--tinted" id="depoimentos">
      <div className="container">
        <SectionHeading
          eyebrow="Depoimentos"
          title="Quem já viajou com a gente"
          align="center"
        />

        <div className="testimonials">
          {items.map((testimonial) => (
            <figure className="testimonial" key={testimonial.name}>
              <blockquote>{testimonial.text}</blockquote>
              <figcaption>
                <span className="testimonial__avatar" aria-hidden="true">
                  {initials(testimonial.name)}
                </span>
                <span>
                  <strong>{testimonial.name}</strong>
                  <small>{testimonial.city}</small>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
