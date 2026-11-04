import SectionHeading from './SectionHeading';
import { CheckIcon } from './icons';

const aboutImage =
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=900&q=75';

const values = [
  'Roteiro escrito por quem já esteve lá, não por um algoritmo.',
  'Atendimento direto com a Carla e o Renato, do primeiro contato ao retorno.',
  'Suporte no fuso da sua viagem: WhatsApp respondido, inclusive no fim de semana.',
];

export default function About() {
  return (
    <section className="section" id="sobre">
      <div className="container about">
        <div className="about__media">
          <img
            src={aboutImage}
            alt="Estrada de terra entre montanhas em um dia de sol"
            loading="lazy"
            width={900}
            height={1100}
          />
          <div className="about__stamp">
            <strong>10 anos</strong>
            <span>de estrada e histórias</span>
          </div>
        </div>

        <div className="about__copy">
          <SectionHeading
            eyebrow="Sobre nós"
            title="Carla e Renato, do lado de cá do balcão"
            description="A Por Aí Turismo nasceu de uma caderneta cheia de endereços e de uma vontade grande de mostrar o mundo sem pressa. Hoje somos dois, mais uma rede de guias e motoristas parceiros em cada destino."
          />

          <ul className="about__values">
            {values.map((value) => (
              <li key={value}>
                <CheckIcon className="icon icon--check" />
                {value}
              </li>
            ))}
          </ul>

          <p className="about__signature">
            “A gente não vende pacote. A gente organiza a viagem que você já queria fazer.”
          </p>
        </div>
      </div>
    </section>
  );
}
