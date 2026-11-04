import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Destinations from './components/Destinations';
import Packages from './components/Packages';
import About from './components/About';
import Testimonials from './components/Testimonials';
import QuoteForm from './components/QuoteForm';
import Footer from './components/Footer';
import { fetchCatalog } from './api';
import type { Catalog } from './types';

export default function App() {
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;

    fetchCatalog()
      .then((data) => {
        if (active) setCatalog(data);
      })
      .catch(() => {
        if (active) setFailed(true);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <Navbar />

      {failed ? (
        <p className="data-warning" role="status">
          Não conseguimos carregar o catálogo agora — mas você pode pedir seu orçamento abaixo.
        </p>
      ) : null}

      <main>
        <Hero />
        <Destinations items={catalog?.destinations ?? []} loading={!catalog && !failed} />
        <Packages items={catalog?.packages ?? []} />
        <About />
        <Testimonials items={catalog?.testimonials ?? []} />
        <QuoteForm destinations={catalog?.destinations ?? []} />
      </main>

      <Footer />
    </>
  );
}
