'use client'
import { useState, useEffect } from 'react'
import { UNIVERSITIES, PACKAGES } from '@/types'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function ApplyPage() {
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [emailInput, setEmailInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup')
  const [authError, setAuthError] = useState('')
  const [authBusy, setAuthBusy] = useState(false)

  const [selected, setSelected] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [pkg, setPkg] = useState<'basic' | 'standard' | 'premium'>('standard')
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '' })
  const [passport, setPassport] = useState<File | null>(null)
  const [certificates, setCertificates] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user) {
        setForm(prev => ({
          firstName: user.user_metadata?.given_name ?? prev.firstName,
          lastName: user.user_metadata?.family_name ?? prev.lastName,
          email: user.email ?? prev.email,
          phone: prev.phone,
        }))
      }
      setAuthLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) {
        setForm(prev => ({
          firstName: u.user_metadata?.given_name ?? prev.firstName,
          lastName: u.user_metadata?.family_name ?? prev.lastName,
          email: u.email ?? prev.email,
          phone: prev.phone,
        }))
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  async function signInGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/apply` },
    })
  }

  async function signInEmail() {
    if (!emailInput || !passwordInput) { setAuthError('Email iyo password geli'); return }
    setAuthBusy(true)
    setAuthError('')
    try {
      if (authMode === 'signup') {
        const { error } = await supabase.auth.signUp({ email: emailInput, password: passwordInput })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: emailInput, password: passwordInput })
        if (error) throw error
      }
    } catch (err: any) {
      setAuthError(err.message ?? 'Khalad ayaa dhacay')
    } finally {
      setAuthBusy(false)
    }
  }

  const filtered = UNIVERSITIES.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.city.toLowerCase().includes(search.toLowerCase())
  )

  const maxUnis = PACKAGES[pkg].maxUnis

  function toggleUni(id: string) {
    if (selected.includes(id)) {
      setSelected(selected.filter(s => s !== id))
    } else {
      if (selected.length >= maxUnis) {
        alert(`Package-kaaga (${PACKAGES[pkg].name}) waxay oggoshahay ugu badnaan ${maxUnis} jaamacadood`)
        return
      }
      setSelected([...selected, id])
    }
  }

  async function uploadFile(file: File, path: string): Promise<string> {
    const { data, error } = await supabase.storage.from('documents').upload(path, file, { upsert: true })
    if (error) throw error
    const { data: { publicUrl } } = supabase.storage.from('documents').getPublicUrl(data.path)
    return publicUrl
  }

  async function handleSubmit() {
    if (!form.firstName || !form.email || !form.phone) {
      setError('Fadlan dhammaan meelaha buuxi')
      return
    }
    if (selected.length === 0) {
      setError('Fadlan jaamacad ugu yaraan hal dooro')
      return
    }
    if (!passport) {
      setError('Fadlan passport-kaaga PDF ah soo dir')
      return
    }

    setLoading(true)
    setError('')

    try {
      const ts = Date.now()

      const passportUrl = await uploadFile(passport, `passports/${ts}-${passport.name}`)

      const certUrls: string[] = []
      for (const cert of certificates) {
        const url = await uploadFile(cert, `certificates/${ts}-${cert.name}`)
        certUrls.push(url)
      }

      const { error: dbError } = await supabase.from('applications').insert({
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        phone: form.phone,
        package: pkg,
        universities: selected.map(id => UNIVERSITIES.find(u => u.id === id)?.name).filter(Boolean),
        status: 'pending',
        passport_url: passportUrl,
        certificate_urls: certUrls,
      })

      if (dbError) throw dbError
      setSubmitted(true)
    } catch (err) {
      console.error(err)
      setError('Khalad ayaa dhacay. Dib u isku day.')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--text-muted)' }}>Waa la hubinayaa...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--teal-dark)', padding: 32 }}>
        <div style={{ background: '#fff', borderRadius: 20, padding: 40, maxWidth: 420, width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>🎓</div>
            <h2 style={{ fontSize: 21, fontWeight: 700, color: 'var(--teal-dark)', marginBottom: 6 }}>Codsiga bilow</h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Account samee ama gal si aad codsigaaga u dirsato
            </p>
          </div>

          {/* Google */}
          <button
            onClick={signInGoogle}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '13px 24px', borderRadius: 10, border: '1.5px solid var(--border)', background: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 500, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: 20 }}
          >
            <GoogleIcon />
            Google ku gal
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>ama email ku gal</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          {/* Mode toggle */}
          <div style={{ display: 'flex', background: 'var(--gray-soft)', borderRadius: 8, padding: 3, marginBottom: 16 }}>
            {(['signup', 'signin'] as const).map(m => (
              <button key={m} onClick={() => { setAuthMode(m); setAuthError('') }} style={{ flex: 1, padding: '7px 0', borderRadius: 6, border: 'none', fontSize: 13, cursor: 'pointer', fontWeight: authMode === m ? 600 : 400, background: authMode === m ? '#fff' : 'transparent', color: authMode === m ? 'var(--teal-dark)' : 'var(--text-muted)', boxShadow: authMode === m ? '0 1px 4px rgba(0,0,0,0.1)' : 'none' }}>
                {m === 'signup' ? 'Account Cusub' : 'Gal'}
              </button>
            ))}
          </div>

          {/* Email */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
            <label style={{ fontSize: 12, color: 'var(--text-muted)' }}>Email</label>
            <input
              type="email"
              placeholder="axmed@gmail.com"
              value={emailInput}
              onChange={e => setEmailInput(e.target.value)}
              style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '10px 12px', fontSize: 14, outline: 'none', width: '100%' }}
            />
          </div>

          {/* Password */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: 'var(--text-muted)' }}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={passwordInput}
              onChange={e => setPasswordInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && signInEmail()}
              style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '10px 12px', fontSize: 14, outline: 'none', width: '100%' }}
            />
          </div>

          {authError && (
            <div style={{ background: '#FCEBEB', color: '#791F1F', borderRadius: 8, padding: '9px 12px', fontSize: 13, marginBottom: 12 }}>
              {authError}
            </div>
          )}

          <button
            onClick={signInEmail}
            disabled={authBusy}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', opacity: authBusy ? 0.7 : 1 }}
          >
            {authBusy ? 'Sugaya...' : authMode === 'signup' ? 'Account Samee →' : 'Gal →'}
          </button>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--teal-dark)', padding: 32 }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: 48, maxWidth: 480, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--teal-dark)', marginBottom: 12 }}>Codsi la diray!</h2>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 8 }}>
            Mahadsanid <strong>{form.firstName}</strong>. Hormar team 24 saac gudahood kula xiriiri doontaa WhatsApp-kaaga.
          </p>
          <button
            onClick={() => { setSubmitted(false); setSelected([]); setForm(prev => ({ ...prev, phone: '' })); setPassport(null); setCertificates([]) }}
            className="btn-primary"
          >
            Codsi cusub bilow
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--teal-dark)', padding: '56px 32px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* User badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div className="section-label" style={{ color: '#9FE1CB' }}>Codsi</div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Jaamacad dooro, form buuxi</h1>
            <p style={{ fontSize: 15, color: '#9FE1CB' }}>Bidix jaamacadaha ka dooro — midig macluumaadkaaga geli</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 12, padding: '8px 14px', flexShrink: 0 }}>
            {user.user_metadata?.avatar_url && (
              <img src={user.user_metadata.avatar_url} alt="" style={{ width: 28, height: 28, borderRadius: '50%' }} />
            )}
            <span style={{ fontSize: 13, color: '#9FE1CB', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</span>
            <button onClick={() => supabase.auth.signOut().then(() => window.location.reload())} style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              Bax
            </button>
          </div>
        </div>

        <div className="apply-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }}>

          {/* UNI LIST */}
          <div style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: 20 }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.6)', marginBottom: 14 }}>
              🏛 Jaamacadaha Turkey — dooro (max {maxUnis})
            </p>
            <input
              type="text"
              placeholder="Raadi jaamacad..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#fff', outline: 'none', marginBottom: 12 }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 340, overflowY: 'auto' }}>
              {filtered.map(u => {
                const isSel = selected.includes(u.id)
                return (
                  <div key={u.id} onClick={() => toggleUni(u.id)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, cursor: 'pointer', border: isSel ? '1px solid var(--teal)' : '1px solid transparent', background: isSel ? 'rgba(29,158,117,0.25)' : 'transparent' }}>
                    <div style={{ width: 34, height: 34, borderRadius: 8, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, background: u.bg, color: u.color }}>
                      {u.abbr}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: '#fff' }}>{u.name}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{u.city}</div>
                    </div>
                    {isSel && <span style={{ color: 'var(--teal)', fontSize: 16 }}>✓</span>}
                  </div>
                )
              })}
            </div>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 10 }}>
              {selected.length > 0 ? `${selected.length} jaamacad la doortay` : 'Wax la dooran waayo'}
            </p>
          </div>

          {/* FORM */}
          <div style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, padding: 24 }}>

            {/* Selected unis */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 6 }}>Jaamacadaha la doortay</div>
              <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '10px 12px', minHeight: 42, fontSize: 13, color: selected.length === 0 ? 'rgba(255,255,255,0.4)' : '#fff' }}>
                {selected.length === 0 ? 'Bidix jaamacad ka dooro...' : selected.map(id => {
                  const u = UNIVERSITIES.find(u => u.id === id)
                  return (
                    <span key={id} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(29,158,117,0.3)', border: '1px solid var(--teal)', borderRadius: 8, padding: '2px 8px', fontSize: 12, color: '#9FE1CB', margin: 2 }}>
                      {u?.abbr} {u?.city}
                    </span>
                  )
                })}
              </div>
            </div>

            {/* Name */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              {(['firstName', 'lastName'] as const).map(field => (
                <div key={field} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{field === 'firstName' ? 'Magaca hore' : 'Magaca dambe'}</label>
                  <input
                    type="text"
                    placeholder={field === 'firstName' ? 'Axmed' : 'Cabdi'}
                    value={form[field]}
                    onChange={e => setForm({ ...form, [field]: e.target.value })}
                    style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, padding: '9px 12px', fontSize: 14, color: '#fff', outline: 'none' }}
                  />
                </div>
              ))}
            </div>

            {/* Email — pre-filled from Google, read-only */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Email (Google)</label>
              <input
                type="email"
                value={form.email}
                readOnly
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '9px 12px', fontSize: 14, color: 'rgba(255,255,255,0.7)', outline: 'none', cursor: 'default' }}
              />
            </div>

            {/* Phone */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Telefoon (WhatsApp)</label>
              <input type="tel" placeholder="+252 61 xxx xxxx" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, padding: '9px 12px', fontSize: 14, color: '#fff', outline: 'none' }} />
            </div>

            {/* Package */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Package dooro</label>
              <select value={pkg} onChange={e => { setPkg(e.target.value as typeof pkg); setSelected([]) }} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, padding: '9px 12px', fontSize: 14, color: '#fff', outline: 'none', width: '100%' }}>
                <option value="basic">Basic — $150 (1 jaamacad)</option>
                <option value="standard">Standard — $280 (3 jaamacad)</option>
                <option value="premium">Premium — $450 (5 jaamacad)</option>
              </select>
            </div>

            {/* Passport upload */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Passport (PDF) *</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.1)', border: passport ? '1px solid var(--teal)' : '1px solid rgba(255,255,255,0.2)', borderRadius: 8, padding: '9px 12px', cursor: 'pointer' }}>
                <span style={{ fontSize: 16 }}>📄</span>
                <span style={{ fontSize: 13, color: passport ? '#9FE1CB' : 'rgba(255,255,255,0.5)' }}>
                  {passport ? passport.name : 'Passport PDF soo dooro...'}
                </span>
                <input type="file" accept=".pdf,application/pdf" style={{ display: 'none' }} onChange={e => setPassport(e.target.files?.[0] ?? null)} />
              </label>
            </div>

            {/* Certificates upload */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
              <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Shahaadooyinka (PDF) — optional</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.1)', border: certificates.length > 0 ? '1px solid var(--teal)' : '1px solid rgba(255,255,255,0.2)', borderRadius: 8, padding: '9px 12px', cursor: 'pointer' }}>
                <span style={{ fontSize: 16 }}>🎓</span>
                <span style={{ fontSize: 13, color: certificates.length > 0 ? '#9FE1CB' : 'rgba(255,255,255,0.5)' }}>
                  {certificates.length > 0 ? `${certificates.length} file la doortay` : 'Shahaadooyinka PDF soo dooro...'}
                </span>
                <input type="file" accept=".pdf,application/pdf" multiple style={{ display: 'none' }} onChange={e => setCertificates(Array.from(e.target.files ?? []))} />
              </label>
            </div>

            {error && (
              <div style={{ background: '#FCEBEB', color: '#791F1F', borderRadius: 8, padding: '10px 14px', fontSize: 13, marginBottom: 12 }}>
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{ width: '100%', background: loading ? 'rgba(255,255,255,0.5)' : '#fff', color: 'var(--teal-dark)', border: 'none', padding: 12, borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? 'Waa la diraya...' : 'Codsi Dir →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.5l6.8-6.8C35.8 2.5 30.3 0 24 0 14.6 0 6.6 5.4 2.6 13.3l7.9 6.2C12.4 13.1 17.7 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.9 24.5c0-1.7-.1-3.3-.4-4.9H24v9.3h12.9c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.3-4 6.8-9.9 6.8-17.4z"/>
      <path fill="#FBBC05" d="M10.5 28.5c-.5-1.5-.8-3.1-.8-4.7s.3-3.2.8-4.7l-7.9-6.2C.9 16.2 0 19.9 0 24s.9 7.8 2.6 11.1l7.9-6.6z"/>
      <path fill="#34A853" d="M24 48c6.2 0 11.5-2.1 15.3-5.7l-7.5-5.8c-2.1 1.4-4.7 2.2-7.8 2.2-6.3 0-11.6-4.2-13.5-9.9l-7.9 6.6C6.6 42.6 14.6 48 24 48z"/>
    </svg>
  )
}
