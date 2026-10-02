'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AlertCircle, Building2, Check, CreditCard, Info, Landmark, Lock, User } from 'lucide-react'
import { useRef, useState } from 'react'

import { useCart } from '@/components/cart/CartProvider'
import { TotalsRows } from '@/components/cart/TotalsRows'
import { LegalBody } from '@/components/legal/LegalBody'
import { PackShot } from '@/components/product/PackShot'
import { Dialog } from '@/components/ui/Dialog'
import { company } from '@/data/company'
import { productFacts, productText } from '@/data/products'
import { provinces } from '@/data/provinces'
import { site } from '@/data/site'
import { clearCart } from '@/lib/cart'
import { initialValues, placeOrder, toOrderContext, validate, type CheckoutValues, type Errors } from '@/lib/checkout'
import { formatPrice } from '@/lib/format'
import { useI18n } from '@/lib/i18n/client'
import { getLegalDoc } from '@/lib/legal/documents'
import { scentTheme } from '@/lib/scents'

type DocSlug = 'on-bilgilendirme-formu' | 'mesafeli-satis-sozlesmesi'

function Section({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-line bg-white p-5 sm:p-7" aria-labelledby={`adim-${n}`}>
      <h2 id={`adim-${n}`} className="flex items-center gap-3 text-xl font-semibold">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-[0.9375rem] font-bold text-white">{n}</span>
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  )
}

function Field({
  id,
  label,
  error,
  hint,
  optional,
  className = '',
  children,
}: {
  id: string
  label: string
  error?: string
  hint?: string
  optional?: boolean
  className?: string
  children: React.ReactNode
}) {
  const { t } = useI18n()
  return (
    <div className={className}>
      <label htmlFor={id} className="field-label">
        {label} {optional && <span className="font-normal text-ink-mute">({t.common.optional})</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="field-error">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="field-hint">
            {hint}
          </p>
        )
      )}
    </div>
  )
}

function ChoiceCard({
  name,
  checked,
  onChange,
  icon,
  title,
  text,
}: {
  name: string
  checked: boolean
  onChange: () => void
  icon: React.ReactNode
  title: string
  text?: string
}) {
  return (
    <label
      className={`relative flex cursor-pointer gap-3.5 rounded-2xl border p-4 transition ${checked ? 'border-ink bg-paper ring-1 ring-ink' : 'border-line-strong hover:border-ink/50'}`}
    >
      <input type="radio" name={name} checked={checked} onChange={onChange} className="sr-only" />
      <span
        aria-hidden="true"
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${checked ? 'border-ink bg-ink' : 'border-line-strong bg-white'}`}
      >
        {checked && <span className="h-2 w-2 rounded-full bg-white" />}
      </span>
      <span className="flex-1">
        <span className="flex items-center gap-2 font-semibold">
          {icon}
          {title}
        </span>
        {text && <span className="mt-1 block text-[0.9375rem] text-ink-soft">{text}</span>}
      </span>
    </label>
  )
}

export function CheckoutView() {
  const cart = useCart()
  const router = useRouter()
  const { locale, t, paths } = useI18n()
  const c = t.checkout
  const F = c.fields
  const [values, setValues] = useState<CheckoutValues>(initialValues)
  const [errors, setErrors] = useState<Errors>({})
  const [attempted, setAttempted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [doc, setDoc] = useState<DocSlug | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const set = <K extends keyof CheckoutValues>(key: K, value: CheckoutValues[K]) => {
    const next = { ...values, [key]: value }
    setValues(next)
    // After the first submit, errors update live so they disappear as soon as they're fixed.
    if (attempted) setErrors(validate(next, t))
  }

  const text = (key: keyof CheckoutValues) => ({
    id: key,
    name: key,
    value: values[key] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => set(key, e.target.value as never),
    'aria-invalid': errors[key] ? true : undefined,
    'aria-describedby': errors[key] ? `${key}-error` : undefined,
    className: 'field',
  })

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setAttempted(true)
    const found = validate(values, t)
    setErrors(found)
    const first = Object.keys(found)[0]
    if (first) {
      const el = formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)
      el?.focus()
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    setSubmitting(true)
    await placeOrder(values, cart, locale, t)
    router.push(paths.orderReceived)
    clearCart()
  }

  if (submitting) {
    return (
      <div className="container py-24 text-center" role="status">
        <span className="mx-auto block h-10 w-10 animate-spin rounded-full border-4 border-line border-t-ink" aria-hidden="true" />
        <p className="mt-5 text-lg font-semibold">{c.submitting}</p>
      </div>
    )
  }

  if (cart.count === 0) {
    return (
      <div className="container py-20 text-center">
        <h1 className="font-display text-4xl font-medium">{c.emptyTitle}</h1>
        <p className="mt-3 text-ink-soft">{c.emptyLead}</p>
        <Link href={paths.products} className="btn-primary mt-8 px-8">
          {t.common.seeProducts}
        </Link>
      </div>
    )
  }

  const ctx = toOrderContext(values, cart, locale, t)
  const errorCount = Object.keys(errors).length

  return (
    <div className="container pb-20 pt-8 lg:pb-28">
      <ol className="flex flex-wrap items-center gap-2 text-sm font-semibold" aria-label={c.steps.label}>
        <li className="flex items-center gap-2 text-leaf">
          <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
          <Link href={paths.cart} className="hover:underline">
            {c.steps.cart}
          </Link>
        </li>
        <li aria-hidden="true" className="h-px w-6 bg-line-strong" />
        <li aria-current="step" className="rounded-full bg-lavanta px-3 py-1 text-white">
          {c.steps.details}
        </li>
        <li aria-hidden="true" className="h-px w-6 bg-line-strong" />
        <li className="text-ink-mute">{c.steps.done}</li>
      </ol>

      <h1 className="mt-6 font-display text-[clamp(2.25rem,4.5vw,3.25rem)] font-medium leading-tight">{c.title}</h1>
      <p className="mt-2 text-ink-soft">{c.lead}</p>

      {site.demoMode && (
        <p className="mt-6 flex gap-3 rounded-2xl border border-notice/25 bg-notice-soft px-4 py-3 text-[0.9375rem] text-notice">
          <Info className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <span>
            <strong className="font-semibold">{c.demoStrong}</strong> {c.demo}
          </span>
        </p>
      )}

      <form ref={formRef} onSubmit={onSubmit} noValidate className="mt-8 grid items-start gap-8 lg:grid-cols-[1.45fr_1fr] lg:gap-10">
        <div className="space-y-5">
          {attempted && errorCount > 0 && (
            <p role="alert" className="flex gap-3 rounded-2xl bg-alert-soft px-4 py-3 font-medium text-alert">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              {c.errorSummary(errorCount)}
            </p>
          )}

          <Section n={1} title={c.sections.contact}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="firstName" label={F.firstName} error={errors.firstName}>
                <input {...text('firstName')} autoComplete="given-name" />
              </Field>
              <Field id="lastName" label={F.lastName} error={errors.lastName}>
                <input {...text('lastName')} autoComplete="family-name" />
              </Field>
              <Field id="email" label={F.email} error={errors.email} hint={F.emailHint}>
                <input {...text('email')} type="email" autoComplete="email" inputMode="email" placeholder={F.emailPlaceholder} />
              </Field>
              <Field id="phone" label={F.phone} error={errors.phone} hint={F.phoneHint}>
                <input {...text('phone')} type="tel" autoComplete="tel" inputMode="tel" placeholder={F.phonePlaceholder} />
              </Field>
            </div>
          </Section>

          <Section n={2} title={c.sections.delivery}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="city" label={F.city} error={errors.city}>
                <select {...text('city')} autoComplete="address-level1">
                  <option value="">{F.cityPlaceholder}</option>
                  {provinces.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </Field>
              <Field id="district" label={F.district} error={errors.district}>
                <input {...text('district')} autoComplete="address-level2" />
              </Field>
              <Field id="address" label={F.address} error={errors.address} hint={F.addressHint} className="sm:col-span-2">
                <textarea {...text('address')} rows={3} autoComplete="street-address" />
              </Field>
              <Field id="postalCode" label={F.postalCode} optional error={errors.postalCode}>
                <input {...text('postalCode')} autoComplete="postal-code" inputMode="numeric" maxLength={5} />
              </Field>
            </div>
          </Section>

          <Section n={3} title={c.sections.invoice}>
            <fieldset>
              <legend className="sr-only">{F.invoiceType}</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                <ChoiceCard
                  name="invoiceType"
                  checked={values.invoiceType === 'bireysel'}
                  onChange={() => set('invoiceType', 'bireysel')}
                  icon={<User className="h-4 w-4" aria-hidden="true" />}
                  title={F.individual}
                  text={F.individualText}
                />
                <ChoiceCard
                  name="invoiceType"
                  checked={values.invoiceType === 'kurumsal'}
                  onChange={() => set('invoiceType', 'kurumsal')}
                  icon={<Building2 className="h-4 w-4" aria-hidden="true" />}
                  title={F.corporate}
                  text={F.corporateText}
                />
              </div>
            </fieldset>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {values.invoiceType === 'kurumsal' ? (
                <>
                  <Field id="companyName" label={F.companyName} error={errors.companyName} className="sm:col-span-2">
                    <input {...text('companyName')} autoComplete="organization" />
                  </Field>
                  <Field id="taxOffice" label={F.taxOffice} error={errors.taxOffice}>
                    <input {...text('taxOffice')} />
                  </Field>
                  <Field id="taxNo" label={F.taxNo} error={errors.taxNo}>
                    <input {...text('taxNo')} inputMode="numeric" maxLength={11} />
                  </Field>
                </>
              ) : (
                <Field id="tckn" label={F.tckn} optional error={errors.tckn} hint={F.tcknHint} className="sm:col-span-2">
                  <input {...text('tckn')} inputMode="numeric" maxLength={11} />
                </Field>
              )}
            </div>

            <label className="mt-5 flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={values.billingSame}
                onChange={(e) => set('billingSame', e.target.checked)}
                className="mt-0.5 h-5 w-5 shrink-0 rounded border-line-strong accent-ink"
              />
              <span>{F.billingSame}</span>
            </label>

            {!values.billingSame && (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field id="billingCity" label={F.billingCity} error={errors.billingCity}>
                  <select {...text('billingCity')}>
                    <option value="">{F.cityPlaceholder}</option>
                    {provinces.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field id="billingDistrict" label={F.billingDistrict} error={errors.billingDistrict}>
                  <input {...text('billingDistrict')} />
                </Field>
                <Field id="billingAddress" label={F.billingAddress} error={errors.billingAddress} className="sm:col-span-2">
                  <textarea {...text('billingAddress')} rows={3} />
                </Field>
              </div>
            )}
          </Section>

          <Section n={4} title={c.sections.payment}>
            <fieldset>
              <legend className="sr-only">{c.payment.label}</legend>
              <div className="grid gap-3">
                {site.commerce.paymentMethods.card && (
                  <ChoiceCard
                    name="payment"
                    checked={values.payment === 'card'}
                    onChange={() => set('payment', 'card')}
                    icon={<CreditCard className="h-4 w-4" aria-hidden="true" />}
                    title={c.payment.card}
                    text={c.payment.cardText(company.paymentProvider)}
                  />
                )}
                {site.commerce.paymentMethods.bankTransfer && (
                  <ChoiceCard
                    name="payment"
                    checked={values.payment === 'transfer'}
                    onChange={() => set('payment', 'transfer')}
                    icon={<Landmark className="h-4 w-4" aria-hidden="true" />}
                    title={c.payment.transfer}
                    text={c.payment.transferText}
                  />
                )}
              </div>
            </fieldset>
          </Section>

          <Section n={5} title={c.sections.confirm}>
            <div className="space-y-4">
              <div>
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    name="agreements"
                    checked={values.agreements}
                    onChange={(e) => set('agreements', e.target.checked)}
                    aria-invalid={errors.agreements ? true : undefined}
                    aria-describedby={errors.agreements ? 'agreements-error' : undefined}
                    className="mt-0.5 h-5 w-5 shrink-0 rounded border-line-strong accent-ink"
                  />
                  <span>
                    {c.agreements.before}
                    <button type="button" onClick={() => setDoc('on-bilgilendirme-formu')} className="link font-semibold">
                      {c.agreements.pif}
                    </button>
                    {c.agreements.mid}
                    <button type="button" onClick={() => setDoc('mesafeli-satis-sozlesmesi')} className="link font-semibold">
                      {c.agreements.dsa}
                    </button>
                    {c.agreements.after}
                  </span>
                </label>
                {errors.agreements && (
                  <p id="agreements-error" className="field-error pl-8">
                    {errors.agreements}
                  </p>
                )}
              </div>

              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={values.marketing}
                  onChange={(e) => set('marketing', e.target.checked)}
                  className="mt-0.5 h-5 w-5 shrink-0 rounded border-line-strong accent-ink"
                />
                <span className="text-ink-soft">
                  {c.marketing} <span className="text-ink-mute">({t.common.optional})</span>
                </span>
              </label>

              <p className="text-sm text-ink-mute">
                {c.kvkk.pre}
                <Link href={paths.legalDoc('kvkk-aydinlatma-metni')} target="_blank" className="link font-medium">
                  {c.kvkk.link}
                </Link>
                {c.kvkk.post}
              </p>
            </div>
          </Section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-28" aria-labelledby="siparis-ozeti">
          <div className="rounded-3xl border border-line bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h2 id="siparis-ozeti" className="text-lg font-semibold">
                {c.summary}
              </h2>
              <Link href={paths.cart} className="link text-sm">
                {c.editCart}
              </Link>
            </div>
            <ul className="mt-4 divide-y divide-line">
              {cart.items.map((i) => (
                <li key={i.slug} className="flex items-center gap-3 py-3">
                  <span className={`relative flex h-16 w-16 shrink-0 items-center justify-center rounded-xl p-1.5 ${scentTheme[i.slug].panel}`}>
                    <PackShot scent={i.slug} view="front" className="w-full" />
                    <span className="absolute -right-1.5 -top-1.5 flex h-6 min-w-6 items-center justify-center rounded-full bg-ink px-1 text-xs font-bold text-white">
                      {i.qty}
                    </span>
                  </span>
                  <span className="min-w-0 flex-1 text-[0.9375rem]">
                    <span className="block font-semibold">{i.product.text[locale].scent}</span>
                    <span className="block text-sm text-ink-mute">
                      {productText[locale].name} · {t.common.sheets(productFacts.sheets)}
                    </span>
                  </span>
                  <span className="text-[0.9375rem] font-semibold tabular-nums">{formatPrice(i.lineTotal)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 border-t border-line pt-4">
              <TotalsRows {...cart} />
            </div>
            <button type="submit" disabled={submitting} className="btn-primary mt-6 w-full text-[1.0625rem]">
              <Lock className="h-4 w-4" aria-hidden="true" />
              {submitting ? c.submitting : c.submit(formatPrice(cart.total))}
            </button>
            <p className="mt-3 text-center text-sm text-ink-mute">{c.obligation}</p>
          </div>
          <p className="flex items-center justify-center gap-2 text-sm text-ink-mute">
            <Lock className="h-3.5 w-3.5" aria-hidden="true" /> {c.encrypted}
          </p>
        </aside>
      </form>

      <Dialog
        open={doc !== null}
        onClose={() => setDoc(null)}
        size="lg"
        labelledBy="legal-doc-title"
        title={doc ? getLegalDoc(doc, locale).title : ''}
        footer={
          <button type="button" className="btn-primary w-full" onClick={() => setDoc(null)}>
            {c.docClose}
          </button>
        }
      >
        {doc && (
          <div className="px-5 py-6 sm:px-8">
            <LegalBody doc={getLegalDoc(doc, locale, ctx)} />
          </div>
        )}
      </Dialog>
    </div>
  )
}
