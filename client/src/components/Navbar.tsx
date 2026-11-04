import Brand from './Brand';

const links = [
  { href: '#destinos', label: 'Destinos' },
  { href: '#pacotes', label: 'Pacotes' },
  { href: '#sobre', label: 'Sobre nós' },
  { href: '#depoimentos', label: 'Depoimentos' },
];

export default function Navbar() {
  return (
    <header className="nav">
      <div className="container nav__inner">
        <a className="nav__brand" href="#top" aria-label="Por Aí Turismo, página inicial">
          <Brand />
        </a>

        <nav className="nav__links" aria-label="Navegação principal">
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <a className="btn btn--primary btn--sm nav__cta" href="#orcamento">
          Solicitar orçamento
        </a>
      </div>
    </header>
  );
}
