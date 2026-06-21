'use client'
import { useState, useEffect } from 'react'
import { ApplicationStatus, STATUS_LABELS } from '@/types'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

interface App {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  package: string
  universities: string[]
  status: ApplicationStatus
  created_at: string
  passport_url?: string
  certificate_urls?: string[]
  notes?: string
}

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? '').split(',').map(e => e.trim()).filter(Boolean)
const STATUS_OPTIONS: ApplicationStatus[] = ['pending', 'review', 'submitted', 'accepted', 'rejected']

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [emailInput, setEmailInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [authError, setAuthError] = useState('')
  const [authBusy, setAuthBusy] = useState(false)

  const [apps, setApps] = useState<App[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<ApplicationStatus | 'all'>('all')
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setAuthLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (user && isAdmin(user)) fetchApps()
  }, [user])

  function isAdmin(u: User) {
    if (ADMIN_EMAILS.length === 0) return true
    return ADMIN_EMAILS.includes(u.email ?? '')
  }

  async function signInGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/admin` },
    })
  }

  async function signInEmail() {
    if (!emailInput || !passwordInput) { setAuthError('Email iyo password geli'); return }
    setAuthBusy(true)
    setAuthError('')
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: emailInput, password: passwordInput })
      if (error) throw error
    } catch (err: any) {
      setAuthError(err.message ?? 'Khalad ayaa dhacay')
    } finally {
      setAuthBusy(false)
    }
  }

  async function fetchApps() {
    setLoading(true)
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error && data) setApps(data)
    setLoading(false)
  }

  async function updateStatus(id: string, status: ApplicationStatus) {
    await supabase.from('applications').update({ status }).eq('id', id)
    setApps(apps.map(a => a.id === id ? { ...a, status } : a))
  }

  if (authLoading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--text-muted)' }}>Waa la hubinayaa...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 20, padding: 40, maxWidth: 400, width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>🔐</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Admin Gal</h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Dashboard-ka admin kaliya ayuu galin karaa</p>
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

          {/* Email */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
            <label style={{ fontSize: 12, color: 'var(--text-muted)' }}>Email</label>
            <input
              type="email"
              placeholder="admin@gmail.com"
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
            {authBusy ? 'Sugaya...' : 'Gal →'}
          </button>
        </div>
      </div>
    )
  }

  if (!isAdmin(user)) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 20, padding: 48, maxWidth: 400, width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⛔</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#791F1F', marginBottom: 10 }}>Gelitaan la diidey</h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 8 }}>{user.email}</p>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 24 }}>
            Email-kaan admin rights ma laha.
          </p>
          <button
            onClick={() => supabase.auth.signOut().then(() => window.location.reload())}
            style={{ padding: '10px 24px', borderRadius: 8, border: '1px solid var(--border)', background: '#fff', cursor: 'pointer', fontSize: 14 }}
          >
            Bax
          </button>
        </div>
      </div>
    )
  }

  const filtered = filter === 'all' ? apps : apps.filter(a => a.status === filter)
  const selectedApp = apps.find(a => a.id === selected)

  const stats = {
    total: apps.length,
    review: apps.filter(a => a.status === 'review').length,
    accepted: apps.filter(a => a.status === 'accepted').length,
    revenue: apps.reduce((sum, a) => sum + (a.package === 'basic' ? 150 : a.package === 'standard' ? 280 : 450), 0),
  }

  return (
    <div style={{ padding: '24px 32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Admin Dashboard</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {user.user_metadata?.avatar_url && (
              <img src={user.user_metadata.avatar_url} alt="" style={{ width: 28, height: 28, borderRadius: '50%' }} />
            )}
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{user.email}</span>
          </div>
          <button onClick={fetchApps} style={{ fontSize: 12, padding: '6px 12px', borderRadius: 8, border: '1px solid var(--border)', background: '#fff', cursor: 'pointer', color: 'var(--teal)' }}>
            ↻ Cusboonaysii
          </button>
          <button onClick={() => supabase.auth.signOut().then(() => window.location.reload())} style={{ fontSize: 12, padding: '6px 12px', borderRadius: 8, border: '1px solid var(--border)', background: '#fff', cursor: 'pointer', color: 'var(--text-muted)' }}>
            Bax
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Codsiyada guud', val: stats.total, sub: 'Kulligood' },
          { label: 'Review sugaya', val: stats.review, sub: 'Degdeg loo baahan yahay' },
          { label: 'La qebilay', val: stats.accepted, sub: stats.total > 0 ? `${Math.round(stats.accepted / stats.total * 100)}% rate` : '0% rate' },
          { label: 'Dakhliga', val: `$${stats.revenue.toLocaleString()}`, sub: 'Wadarta' },
        ].map((s, i) => (
          <div key={i} style={{ background: 'var(--gray-soft)', borderRadius: 8, padding: 16 }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{s.val}</div>
            <div style={{ fontSize: 11, color: 'var(--teal)' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* FILTER */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        {(['all', ...STATUS_OPTIONS] as const).map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{ padding: '6px 14px', borderRadius: 8, fontSize: 13, cursor: 'pointer', border: 'none', background: filter === s ? 'var(--teal-light)' : 'var(--gray-soft)', color: filter === s ? 'var(--teal-dark)' : 'var(--text-muted)', fontWeight: filter === s ? 600 : 400 }}>
            {s === 'all' ? 'Dhammaan' : STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>Waa la rarayo...</div>
      ) : apps.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)', background: 'var(--gray-soft)', borderRadius: 12 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📭</div>
          <div>Wali codsiyada ma jiraan</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 360px' : '1fr', gap: 16 }}>
          {/* TABLE */}
          <div className="admin-table-wrap">
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', minWidth: 560 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr', gap: 12, padding: '12px 16px', background: 'var(--gray-soft)', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>
                <div>Arday</div><div>Jaamacadaha</div><div>Package</div><div>Status</div><div>Ficil</div>
              </div>
              {filtered.map(app => (
                <div key={app.id} onClick={() => setSelected(selected === app.id ? null : app.id)} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr', gap: 12, padding: '12px 16px', borderTop: '1px solid var(--border)', alignItems: 'center', background: selected === app.id ? 'var(--teal-light)' : 'transparent', cursor: 'pointer' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{app.first_name} {app.last_name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{app.email}</div>
                  </div>
                  <div style={{ fontSize: 12 }}>{app.universities?.join(' · ')}</div>
                  <div>
                    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 8, background: 'var(--gray-soft)', color: 'var(--text-muted)' }}>
                      {app.package}
                    </span>
                  </div>
                  <div>
                    <span className={`status-badge status-${app.status}`}>
                      {STATUS_LABELS[app.status as ApplicationStatus] ?? app.status}
                    </span>
                  </div>
                  <div>
                    <button style={{ fontSize: 12, color: 'var(--teal)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Fur →</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DETAIL PANEL */}
          {selectedApp && (
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600 }}>{selectedApp.first_name} {selectedApp.last_name}</h3>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>✕</button>
              </div>

              {[
                { label: 'Email', val: selectedApp.email },
                { label: 'Telefoon', val: selectedApp.phone },
                { label: 'Package', val: selectedApp.package },
                { label: 'Jaamacadaha', val: selectedApp.universities?.join(', ') },
                { label: 'Taariikh', val: new Date(selectedApp.created_at).toLocaleDateString('so') },
              ].map(({ label, val }) => (
                <div key={label} style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>{label}</div>
                  <div style={{ fontSize: 13 }}>{val}</div>
                </div>
              ))}

              {selectedApp.passport_url && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>Xogaha</div>
                  <a href={selectedApp.passport_url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--teal)', textDecoration: 'none', padding: '6px 10px', background: 'var(--teal-light)', borderRadius: 8, marginBottom: 6 }}>
                    📄 Passport arag
                  </a>
                  {selectedApp.certificate_urls?.map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--teal)', textDecoration: 'none', padding: '6px 10px', background: 'var(--teal-light)', borderRadius: 8, marginBottom: 6 }}>
                      🎓 Shahaado {i + 1} arag
                    </a>
                  ))}
                </div>
              )}

              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Status bedel</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {STATUS_OPTIONS.map(s => (
                    <button key={s} onClick={() => updateStatus(selectedApp.id, s)} style={{ padding: '8px 12px', borderRadius: 8, fontSize: 13, cursor: 'pointer', border: '1px solid var(--border)', textAlign: 'left', background: selectedApp.status === s ? 'var(--teal-light)' : '#fff', color: selectedApp.status === s ? 'var(--teal-dark)' : 'var(--text)', fontWeight: selectedApp.status === s ? 600 : 400 }}>
                      {selectedApp.status === s ? '● ' : '○ '}{STATUS_LABELS[s]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
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
