'use client'
import { useState } from 'react'
import { UNIVERSITIES, PACKAGES } from '@/types'

export default function ApplyPage() {
  const [selected, setSelected] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [pkg, setPkg] = useState<'basic' | 'standard' | 'premium'>('standard')
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '' })
  const [submitted, setSubmitted] = useState(false)

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

  function handleSubmit() {
    if (!form.firstName || !form.email || !form.phone) {
      alert('Fadlan dhammaan meelaha buuxi')
      return
    }
    if (selected.length === 0) {
      alert('Fadlan jaamacad ugu yaraan hal dooro')
      return
    }
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div style={{
        minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--teal-dark)', padding: 32,
      }}>
        <div style={{
          background: '#fff', borderRadius: 16, padding: 48, maxWidth: 480,
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--teal-dark)', marginBottom: 12 }}>
            Codsi la diray!
          </h2>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 8 }}>
            Mahadsanid <strong>{form.firstName}</strong>. Hormar team 24 saac gudahood kula xiriiri doontaa WhatsApp-kaaga.
          </p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>
            Jaamacadaha: {selected.map(id => UNIVERSITIES.find(u => u.id === id)?.name).join(' · ')}
          </p>
          <button
            onClick={() => { setSubmitted(false); setSelected([]); setForm({ firstName: '', lastName: '', email: '', phone: '' }) }}
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
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div className="section-label" style={{ color: '#9FE1CB' }}>Codsi</div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 8 }}>
            Jaamacad dooro, form buuxi
          </h1>
          <p style={{ fontSize: 15, color: '#9FE1CB' }}>
            Bidix jaamacadaha ka dooro — midig macluumaadkaaga geli
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }}>

          {/* UNI LIST */}
          <div style={{
            background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 12, padding: 20,
          }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.6)', marginBottom: 14 }}>
              🏛 Jaamacadaha Turkey — dooro (max {maxUnis})
            </p>
            <input
              type="text"
              placeholder="Raadi jaamacad..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#fff',
                outline: 'none', marginBottom: 12,
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 340, overflowY: 'auto' }}>
              {filtered.map(u => {
                const isSel = selected.includes(u.id)
                return (
                  <div
                    key={u.id}
                    onClick={() => toggleUni(u.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 12px', borderRadius: 8, cursor: 'pointer',
                      border: isSel ? '1px solid var(--teal)' : '1px solid transparent',
                      background: isSel ? 'rgba(29,158,117,0.25)' : 'transparent',
                    }}
                  >
                    <div style={{
                      width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 600,
                      background: u.bg, color: u.color,
                    }}>
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
          <div style={{
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 12, padding: 24,
          }}>
            {/* Selected unis display */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 6 }}>
                Jaamacadaha la doortay
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 8, padding: '10px 12px', minHeight: 42, fontSize: 13,
                color: selected.length === 0 ? 'rgba(255,255,255,0.4)' : '#fff',
              }}>
                {selected.length === 0
                  ? 'Bidix jaamacad ka dooro...'
                  : selected.map(id => {
                    const u = UNIVERSITIES.find(u => u.id === id)
                    return (
                      <span key={id} style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        background: 'rgba(29,158,117,0.3)', border: '1px solid var(--teal)',
                        borderRadius: 8, padding: '2px 8px', fontSize: 12, color: '#9FE1CB', margin: 2,
                      }}>
                        {u?.abbr} {u?.city}
                      </span>
                    )
                  })
                }
              </div>
            </div>

            {/* Name row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              {(['firstName', 'lastName'] as const).map(field => (
                <div key={field} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
                    {field === 'firstName' ? 'Magaca hore' : 'Magaca dambe'}
                  </label>
                  <input
                    type="text"
                    placeholder={field === 'firstName' ? 'Axmed' : 'Cabdi'}
                    value={form[field]}
                    onChange={e => setForm({ ...form, [field]: e.target.value })}
                    style={{
                      background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: 8, padding: '9px 12px', fontSize: 14, color: '#fff', outline: 'none',
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Email */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Email</label>
              <input
                type="email" placeholder="axmed@email.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                style={{
                  background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 8, padding: '9px 12px', fontSize: 14, color: '#fff', outline: 'none',
                }}
              />
            </div>

            {/* Phone */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Telefoon (WhatsApp)</label>
              <input
                type="tel" placeholder="+252 61 xxx xxxx"
                value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                style={{
                  background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 8, padding: '9px 12px', fontSize: 14, color: '#fff', outline: 'none',
                }}
              />
            </div>

            {/* Package */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
              <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Package dooro</label>
              <select
                value={pkg}
                onChange={e => { setPkg(e.target.value as typeof pkg); setSelected([]) }}
                style={{
                  background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 8, padding: '9px 12px', fontSize: 14, color: '#fff', outline: 'none', width: '100%',
                }}
              >
                <option value="basic">Basic — $150 (1 jaamacad)</option>
                <option value="standard">Standard — $280 (3 jaamacad)</option>
                <option value="premium">Premium — $450 (5 jaamacad)</option>
              </select>
            </div>

            <button
              onClick={handleSubmit}
              style={{
                width: '100%', background: '#fff', color: 'var(--teal-dark)',
                border: 'none', padding: 12, borderRadius: 8, fontSize: 15,
                fontWeight: 600, cursor: 'pointer',
              }}
            >
              Codsi Dir →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
