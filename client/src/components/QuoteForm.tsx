import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { ApiError, createQuote } from '../api';
import type { Destination } from '../types';
import { ArrowIcon } from './icons';

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  destination: '',
  travelers: '2',
  travelDate: '',
  message: '',
};

type FormState = typeof emptyForm;
type FieldName = keyof FormState;

export default function QuoteForm({ destinations }: { destinations: Destination[] }) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<{ name: string; destination: string } | null>(
    null,
  );

  function update(field: FieldName) {
    return (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { value } = event.target;
      setForm((previous) => ({ ...previous, [field]: value }));
      setErrors((previous) => ({ ...previous, [field]: '' }));
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setFormError(null);

    try {
      await createQuote({
        name: form.name,
        email: form.email,
        phone: form.phone,
        destination: form.destination,
        travelers: Number(form.travelers),
        travelDate: form.travelDate,
        message: form.message,
      });

      setConfirmation({
        name: form.name.trim().split(' ')[0],
        destination: form.destination,
      });
      setForm(emptyForm);
      setErrors({});
    } catch (error) {
      if (error instanceof ApiError) {
        setErrors(error.fields);
        setFormError(
          error.status === 422
            ? 'Confira os campos destacados abaixo.'
            : error.message,
        );
      } else {
        setFormError('Não foi possível enviar agora. Tente novamente em instantes.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="quote" id="orcamento">
      <div className="container quote__grid">
        <div className="quote__intro">
          <p className="eyebrow">Orçamento</p>
          <h2>Conta pra gente o que você imaginou</h2>
          <p className="quote__lead">
            Preencha os dados abaixo e receba uma proposta personalizada — com sugestão de roteiro,
            hospedagem e valor final, sem letras miúdas.
          </p>

          <ul className="quote__contacts">
            <li>
              <span className="quote__label">WhatsApp</span>
              <a href="https://wa.me/5511987654321" target="_blank" rel="noreferrer">
                (11) 98765-4321
              </a>
            </li>
            <li>
              <span className="quote__label">E-mail</span>
              <a href="mailto:contato@poraiviagens.com.br">contato@poraiviagens.com.br</a>
            </li>
            <li>
              <span className="quote__label">Atendimento</span>
              <span>Seg a sex, das 9h às 18h · sábado até 13h</span>
            </li>
          </ul>

          <p className="quote__note">Respondemos em até 1 dia útil. Sem cobrança pela consultoria.</p>
        </div>

        <div className="quote-card">
          {confirmation ? (
            <div className="quote-success" role="status">
              <span className="quote-success__icon" aria-hidden="true">
                ✓
              </span>
              <h3>Pedido enviado, {confirmation.name}!</h3>
              <p>
                Recebemos seu interesse em <strong>{confirmation.destination}</strong>. A Carla e o
                Renato vão responder no e-mail ou WhatsApp informado em até 1 dia útil.
              </p>
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={() => setConfirmation(null)}
              >
                Fazer outro pedido
              </button>
            </div>
          ) : (
            <form className="quote-form" onSubmit={handleSubmit} noValidate>
              <div className="field">
                <label htmlFor="quote-name">Nome completo</label>
                <input
                  id="quote-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Como podemos te chamar?"
                  value={form.name}
                  onChange={update('name')}
                  aria-invalid={Boolean(errors.name)}
                />
                {errors.name ? <span className="field__error">{errors.name}</span> : null}
              </div>

              <div className="field">
                <label htmlFor="quote-email">E-mail</label>
                <input
                  id="quote-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="voce@email.com"
                  value={form.email}
                  onChange={update('email')}
                  aria-invalid={Boolean(errors.email)}
                />
                {errors.email ? <span className="field__error">{errors.email}</span> : null}
              </div>

              <div className="field">
                <label htmlFor="quote-phone">WhatsApp</label>
                <input
                  id="quote-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="(11) 99999-0000"
                  value={form.phone}
                  onChange={update('phone')}
                />
              </div>

              <div className="field">
                <label htmlFor="quote-destination">Destino de interesse</label>
                <select
                  id="quote-destination"
                  name="destination"
                  value={form.destination}
                  onChange={update('destination')}
                  aria-invalid={Boolean(errors.destination)}
                >
                  <option value="">Selecione um destino</option>
                  {destinations.map((destination) => (
                    <option key={destination.id} value={destination.name}>
                      {destination.name} — {destination.country}
                    </option>
                  ))}
                  <option value="Outro destino">Outro destino (contamos no contato)</option>
                </select>
                {errors.destination ? (
                  <span className="field__error">{errors.destination}</span>
                ) : null}
              </div>

              <div className="field">
                <label htmlFor="quote-travelers">Viajantes</label>
                <input
                  id="quote-travelers"
                  name="travelers"
                  type="number"
                  min={1}
                  max={20}
                  value={form.travelers}
                  onChange={update('travelers')}
                  aria-invalid={Boolean(errors.travelers)}
                />
                {errors.travelers ? (
                  <span className="field__error">{errors.travelers}</span>
                ) : null}
              </div>

              <div className="field">
                <label htmlFor="quote-date">Data aproximada</label>
                <input
                  id="quote-date"
                  name="travelDate"
                  type="date"
                  value={form.travelDate}
                  onChange={update('travelDate')}
                />
              </div>

              <div className="field field--full">
                <label htmlFor="quote-message">Conte um pouco sobre a viagem</label>
                <textarea
                  id="quote-message"
                  name="message"
                  rows={3}
                  placeholder="Quantos dias, o que não pode faltar, se é lua de mel, viagem em família..."
                  value={form.message}
                  onChange={update('message')}
                />
              </div>

              {formError ? (
                <p className="form-alert" role="alert">
                  {formError}
                </p>
              ) : null}

              <div className="field--full">
                <button className="btn btn--primary quote-form__submit" type="submit" disabled={submitting}>
                  {submitting ? 'Enviando...' : 'Enviar pedido de orçamento'}
                  {submitting ? null : <ArrowIcon className="icon icon--arrow" />}
                </button>
              </div>

              <p className="quote-form__footnote">
                Seus dados são usados apenas para respondermos este orçamento.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
