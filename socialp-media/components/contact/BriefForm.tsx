'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { useId, useRef, useState } from 'react'

import type { Dictionary } from '@/lib/content'
import { privacy } from '@/lib/content/privacy'
import { contact, href } from '@/lib/site'

/**
 * A brief that needs no backend: it composes the message and hands it to
 * WhatsApp or the visitor's mail app. Nothing is stored or sent from here.
 */
export function BriefForm({ t, services }: { t: Dictionary; services: string[] }) {
  const f = t.contactPage.form
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [picked, setPicked] = useState<string[]>([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState(false)
  const nameRef = useRef<HTMLInputElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)
  const errorId = useId()

  const options = [...services, f.other]
  const toggle = (s: string) => setPicked((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]))

  const compose = () =>
    [
      f.greeting,
      '',
      message.trim(),
      '',
      picked.length ? `${f.interest}: ${picked.join(', ')}` : '',
      [name.trim(), company.trim()].filter(Boolean).join(' — '),
    ]
      .filter((line, i, arr) => line !== '' || (arr[i - 1] ?? '') !== '')
      .join('\n')
      .trim()

  const send = (channel: 'whatsapp' | 'email') => {
    if (!name.trim() || !message.trim()) {
      setError(true)
      const firstMissing = name.trim() ? messageRef.current : nameRef.current
      firstMissing?.focus()
      return
    }
    setError(false)
    const text = compose()
    const url =
      channel === 'whatsapp'
        ? `${contact.whatsappHref}?text=${encodeURIComponent(text)}`
        : `mailto:${t.locale === 'tr' ? contact.tr.email : contact.intl.email}?subject=${encodeURIComponent(
            `${f.subject}${company.trim() ? ` — ${company.trim()}` : ''}`,
          )}&body=${encodeURIComponent(text)}`
    window.open(url, channel === 'whatsapp' ? '_blank' : '_self', 'noopener,noreferrer')
  }

  const field =
    'w-full rounded-xl border border-ink/15 bg-bone px-4 py-3.5 text-[1rem] text-ink placeholder:text-ink/35 transition-colors focus:border-ink focus:outline-none'

  return (
    <form
      className="rounded-[1.75rem] bg-paper p-6 text-ink sm:p-10"
      onSubmit={(e) => {
        e.preventDefault()
        send('whatsapp')
      }}
      noValidate
    >
      <h2 className="display-s">{f.title}</h2>
      <p className="mt-3 max-w-[46ch] text-[0.98rem] text-ink/65">{f.body}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="eyebrow mb-2.5 block text-graphite">{f.name} *</span>
          <input
            className={clsx(field, error && !name.trim() && 'border-signal')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            ref={nameRef}
            autoComplete="name"
            required
            aria-invalid={error && !name.trim()}
            aria-describedby={error && !name.trim() ? errorId : undefined}
          />
        </label>
        <label className="block">
          <span className="eyebrow mb-2.5 block text-graphite">{f.company}</span>
          <input className={field} value={company} onChange={(e) => setCompany(e.target.value)} autoComplete="organization" />
        </label>
      </div>

      <fieldset className="mt-6">
        <legend className="eyebrow mb-3 text-graphite">{f.interest}</legend>
        <div className="flex flex-wrap gap-2">
          {options.map((o) => {
            const on = picked.includes(o)
            return (
              <button
                key={o}
                type="button"
                aria-pressed={on}
                onClick={() => toggle(o)}
                className={clsx(
                  'rounded-full border px-4 py-2 text-[0.92rem] transition-colors duration-300',
                  on ? 'border-ink bg-ink text-bone' : 'border-ink/20 text-ink/80 hover:border-ink/60',
                )}
              >
                {o}
              </button>
            )
          })}
        </div>
      </fieldset>

      <label className="mt-6 block">
        <span className="eyebrow mb-2.5 block text-graphite">{f.message} *</span>
        <textarea
          className={clsx(field, 'min-h-[9rem] resize-y', error && !message.trim() && 'border-signal')}
          placeholder={f.messagePlaceholder}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          ref={messageRef}
          required
          aria-invalid={error && !message.trim()}
          aria-describedby={error && !message.trim() ? errorId : undefined}
        />
      </label>

      <p id={errorId} role="alert" className="mt-4 min-h-[1.4em] text-[0.92rem] font-medium text-signal">
        {error && (!name.trim() || !message.trim()) ? f.required : ''}
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        <button type="submit" className="btn btn-dark">
          <span>{f.sendWhatsapp}</span>
          <span aria-hidden="true" className="arrow-nudge">
            →
          </span>
        </button>
        <button type="button" onClick={() => send('email')} className="btn btn-ghost text-ink [--btn-ghost-hover:var(--color-bone)]">
          <span>{f.sendEmail}</span>
        </button>
      </div>
      <p className="mt-5 text-[0.85rem] text-ink/65">
        {f.note}{' '}
        <Link href={href(t.locale, 'privacy')} className="underline underline-offset-2 hover:text-ink">
          {privacy[t.locale].footerLink}
        </Link>
      </p>
    </form>
  )
}
