import Brand from './Brand';

const navigation = [
  { href: '#destinos', label: 'Destinos' },
  { href: '#pacotes', label: 'Pacotes' },
  { href: '#sobre', label: 'Sobre nós' },
  { href: '#orcamento', label: 'Orçamento' },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <Brand tone="light" />
          <p>
            Viagens sob medida desde 2015. Roteiros autorais, atendimento humano e suporte durante
            toda a viagem.
          </p>
        </div>

        <div>
          <h3>Navegue</h3>
          <ul>
            {navigation.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3>Contato</h3>
          <ul>
            <li>
              <a href="https://wa.me/5511987654321" target="_blank" rel="noreferrer">
                (11) 98765-4321
              </a>
            </li>
            <li>
              <a href="mailto:contato@poraiviagens.com.br">contato@poraiviagens.com.br</a>
            </li>
            <li>Rua das Palmeiras, 128 · São Paulo, SP</li>
          </ul>
        </div>

        <div>
          <h3>Atendimento</h3>
          <ul>
            <li>Seg a sex, das 9h às 18h</li>
            <li>Sábado, das 9h às 13h</li>
            <li>Suporte 24h durante a viagem</li>
          </ul>
        </div>
      </div>

      <div className="container footer__bottom">
        <span>© {new Date().getFullYear()} Por Aí Turismo · CNPJ 00.000.000/0001-00</span>
        <span>Feito com carinho para quem gosta de chegar.</span>
      </div>
    </footer>
  );
}
