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
import { legalHref } from '@/data/legal'
import { productLine } from '@/data/products'
import { provinces } from '@/data/provinces'
import { site } from '@/data/site'
import { clearCart } from '@/lib/cart'
import { initialValues, placeOrder, toOrderContext, validate, type CheckoutValues, type Errors } from '@/lib/checkout'
import { formatPrice } from '@/lib/format'
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
  return (
    <div className={className}>
      <label htmlFor={id} className="field-label">
        {label} {optional && <span className="font-normal text-ink-mute">(isteğe bağlı)</span>}
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
    if (attempted) setErrors(validate(next))
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
    const found = validate(values)
    setErrors(found)
    const first = Object.keys(found)[0]
    if (first) {
      const el = formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)
      el?.focus()
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    setSubmitting(true)
    await placeOrder(values, cart)
    router.push('/siparis-alindi')
    clearCart()
  }

  if (submitting) {
    return (
      <div className="container py-24 text-center" role="status">
        <span className="mx-auto block h-10 w-10 animate-spin rounded-full border-4 border-line border-t-ink" aria-hidden="true" />
        <p className="mt-5 text-lg font-semibold">Siparişiniz alınıyor…</p>
      </div>
    )
  }

  if (cart.count === 0) {
    return (
      <div className="container py-20 text-center">
        <h1 className="font-display text-4xl font-medium">Sepetiniz boş</h1>
        <p className="mt-3 text-ink-soft">Ödeme adımına geçmek için önce sepetinize ürün ekleyin.</p>
        <Link href="/urunler" className="btn-primary mt-8 px-8">
          Ürünleri Gör
        </Link>
      </div>
    )
  }

  const ctx = toOrderContext(values, cart)
  const errorCount = Object.keys(errors).length

  return (
    <div className="container pb-20 pt-8 lg:pb-28">
      <ol className="flex flex-wrap items-center gap-2 text-sm font-semibold" aria-label="Sipariş adımları">
        <li className="flex items-center gap-2 text-leaf">
          <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
          <Link href="/sepet" className="hover:underline">
            Sepet
          </Link>
        </li>
        <li aria-hidden="true" className="h-px w-6 bg-line-strong" />
        <li aria-current="step" className="rounded-full bg-ink px-3 py-1 text-white">
          Bilgiler ve Ödeme
        </li>
        <li aria-hidden="true" className="h-px w-6 bg-line-strong" />
        <li className="text-ink-mute">Onay</li>
      </ol>

      <h1 className="mt-6 font-display text-[clamp(2.25rem,4.5vw,3.25rem)] font-medium leading-tight">Siparişi tamamla</h1>
      <p className="mt-2 text-ink-soft">Birkaç bilgi yeterli. Zorunlu olmayan alanlar “isteğe bağlı” olarak belirtilmiştir.</p>

      {site.demoMode && (
        <p className="mt-6 flex gap-3 rounded-2xl border border-notice/25 bg-notice-soft px-4 py-3 text-[0.9375rem] text-notice">
          <Info className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <span>
            <strong className="font-semibold">Önizleme modu:</strong> Ödeme altyapısı henüz bağlanmadı. Bu sayfada sipariş akışını deneyebilirsiniz;
            gerçek bir ödeme alınmaz ve sipariş oluşturulmaz.
          </span>
        </p>
      )}

      <form ref={formRef} onSubmit={onSubmit} noValidate className="mt-8 grid items-start gap-8 lg:grid-cols-[1.45fr_1fr] lg:gap-10">
        <div className="space-y-5">
          {attempted && errorCount > 0 && (
            <p role="alert" className="flex gap-3 rounded-2xl bg-alert-soft px-4 py-3 font-medium text-alert">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              Lütfen kırmızıyla işaretli {errorCount === 1 ? 'alanı' : `${errorCount} alanı`} kontrol edin.
            </p>
          )}

          <Section n={1} title="İletişim bilgileri">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="firstName" label="Adınız" error={errors.firstName}>
                <input {...text('firstName')} autoComplete="given-name" />
              </Field>
              <Field id="lastName" label="Soyadınız" error={errors.lastName}>
                <input {...text('lastName')} autoComplete="family-name" />
              </Field>
              <Field id="email" label="E-posta adresiniz" error={errors.email} hint="Sipariş onayı bu adrese gönderilir.">
                <input {...text('email')} type="email" autoComplete="email" inputMode="email" placeholder="ad@ornek.com" />
              </Field>
              <Field id="phone" label="Cep telefonunuz" error={errors.phone} hint="Kargo görevlisi gerekirse sizi arar.">
                <input {...text('phone')} type="tel" autoComplete="tel" inputMode="tel" placeholder="05XX XXX XX XX" />
              </Field>
            </div>
          </Section>

          <Section n={2} title="Teslimat adresi">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="city" label="İl" error={errors.city}>
                <select {...text('city')} autoComplete="address-level1">
                  <option value="">İl seçin</option>
                  {provinces.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </Field>
              <Field id="district" label="İlçe" error={errors.district}>
                <input {...text('district')} autoComplete="address-level2" />
              </Field>
              <Field id="address" label="Açık adres" error={errors.address} hint="Mahalle, cadde/sokak, bina ve daire numarası." className="sm:col-span-2">
                <textarea {...text('address')} rows={3} autoComplete="street-address" />
              </Field>
              <Field id="postalCode" label="Posta kodu" optional error={errors.postalCode}>
                <input {...text('postalCode')} autoComplete="postal-code" inputMode="numeric" maxLength={5} />
              </Field>
            </div>
          </Section>

          <Section n={3} title="Fatura bilgileri">
            <fieldset>
              <legend className="sr-only">Fatura türü</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                <ChoiceCard
                  name="invoiceType"
                  checked={values.invoiceType === 'bireysel'}
                  onChange={() => set('invoiceType', 'bireysel')}
                  icon={<User className="h-4 w-4" aria-hidden="true" />}
                  title="Bireysel"
                  text="Kendi adınıza fatura"
                />
                <ChoiceCard
                  name="invoiceType"
                  checked={values.invoiceType === 'kurumsal'}
                  onChange={() => set('invoiceType', 'kurumsal')}
                  icon={<Building2 className="h-4 w-4" aria-hidden="true" />}
                  title="Kurumsal"
                  text="Şirket adına fatura"
                />
              </div>
            </fieldset>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {values.invoiceType === 'kurumsal' ? (
                <>
                  <Field id="companyName" label="Firma unvanı" error={errors.companyName} className="sm:col-span-2">
                    <input {...text('companyName')} autoComplete="organization" />
                  </Field>
                  <Field id="taxOffice" label="Vergi dairesi" error={errors.taxOffice}>
                    <input {...text('taxOffice')} />
                  </Field>
                  <Field id="taxNo" label="Vergi numarası" error={errors.taxNo}>
                    <input {...text('taxNo')} inputMode="numeric" maxLength={11} />
                  </Field>
                </>
              ) : (
                <Field id="tckn" label="T.C. kimlik numarası" optional error={errors.tckn} hint="e-Arşiv fatura için. Boş bırakabilirsiniz." className="sm:col-span-2">
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
              <span>Fatura adresim teslimat adresiyle aynı</span>
            </label>

            {!values.billingSame && (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field id="billingCity" label="Fatura ili" error={errors.billingCity}>
                  <select {...text('billingCity')}>
                    <option value="">İl seçin</option>
                    {provinces.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field id="billingDistrict" label="Fatura ilçesi" error={errors.billingDistrict}>
                  <input {...text('billingDistrict')} />
                </Field>
                <Field id="billingAddress" label="Fatura adresi" error={errors.billingAddress} className="sm:col-span-2">
                  <textarea {...text('billingAddress')} rows={3} />
                </Field>
              </div>
            )}
          </Section>

          <Section n={4} title="Ödeme yöntemi">
            <fieldset>
              <legend className="sr-only">Ödeme yöntemi</legend>
              <div className="grid gap-3">
                {site.commerce.paymentMethods.card && (
                  <ChoiceCard
                    name="payment"
                    checked={values.payment === 'card'}
                    onChange={() => set('payment', 'card')}
                    icon={<CreditCard className="h-4 w-4" aria-hidden="true" />}
                    title="Kredi / Banka Kartı"
                    text={`Siparişi onayladıktan sonra kart bilgilerinizi ${company.paymentProvider} güvenli ödeme sayfasında gireceksiniz. Kart bilgileriniz bizde saklanmaz.`}
                  />
                )}
                {site.commerce.paymentMethods.bankTransfer && (
                  <ChoiceCard
                    name="payment"
                    checked={values.payment === 'transfer'}
                    onChange={() => set('payment', 'transfer')}
                    icon={<Landmark className="h-4 w-4" aria-hidden="true" />}
                    title="Havale / EFT"
                    text="Siparişten sonra banka hesap bilgilerimizi göstereceğiz. Ödemeniz ulaştığında siparişiniz hazırlanır."
                  />
                )}
              </div>
            </fieldset>
          </Section>

          <Section n={5} title="Onay">
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
                    <button type="button" onClick={() => setDoc('on-bilgilendirme-formu')} className="link font-semibold">
                      Ön Bilgilendirme Formu
                    </button>
                    ’nu ve{' '}
                    <button type="button" onClick={() => setDoc('mesafeli-satis-sozlesmesi')} className="link font-semibold">
                      Mesafeli Satış Sözleşmesi
                    </button>
                    ’ni okudum, onaylıyorum.
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
                  Kampanya ve yeniliklerden e-posta ve SMS ile haberdar olmak istiyorum. <span className="text-ink-mute">(isteğe bağlı)</span>
                </span>
              </label>

              <p className="text-sm text-ink-mute">
                Kişisel verileriniz{' '}
                <Link href={legalHref('kvkk-aydinlatma-metni')} target="_blank" className="link font-medium">
                  KVKK Aydınlatma Metni
                </Link>{' '}
                kapsamında işlenir.
              </p>
            </div>
          </Section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-28" aria-labelledby="siparis-ozeti">
          <div className="rounded-3xl border border-line bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h2 id="siparis-ozeti" className="text-lg font-semibold">
                Sipariş özeti
              </h2>
              <Link href="/sepet" className="link text-sm">
                Sepeti düzenle
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
                    <span className="block font-semibold">{i.product.scent}</span>
                    <span className="block text-sm text-ink-mute">
                      {productLine.name} · {productLine.sheets} yaprak
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
              {submitting ? 'Siparişiniz alınıyor…' : `Siparişi Onayla ve Öde · ${formatPrice(cart.total)}`}
            </button>
            <p className="mt-3 text-center text-sm text-ink-mute">Siparişi onayladığınızda ödeme yükümlülüğü altına girersiniz.</p>
          </div>
          <p className="flex items-center justify-center gap-2 text-sm text-ink-mute">
            <Lock className="h-3.5 w-3.5" aria-hidden="true" /> Bilgileriniz şifreli bağlantıyla iletilir.
          </p>
        </aside>
      </form>

      <Dialog
        open={doc !== null}
        onClose={() => setDoc(null)}
        size="lg"
        labelledBy="legal-doc-title"
        title={doc ? getLegalDoc(doc).title : ''}
        footer={
          <button type="button" className="btn-primary w-full" onClick={() => setDoc(null)}>
            Okudum, Kapat
          </button>
        }
      >
        {doc && (
          <div className="px-5 py-6 sm:px-8">
            <LegalBody doc={getLegalDoc(doc, ctx)} />
          </div>
        )}
      </Dialog>
    </div>
  )
}
