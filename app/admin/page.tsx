'use client'
import { useState, useEffect } from 'react'
import { ApplicationStatus, STATUS_LABELS } from '@/types'
import { supabase } from '@/lib/supabase'

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

const STATUS_OPTIONS: ApplicationStatus[] = ['pending', 'review', 'submitted', 'accepted', 'rejected']

export default function AdminPage() {
  const [apps, setApps] = useState<App[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<ApplicationStatus | 'all'>('all')
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => { fetchApps() }, [])

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

  const filtered = filter === 'all' ? apps : apps.filter(a => a.status === filter)
  const selectedApp = apps.find(a => a.id === selected)

  const stats = {
    total: apps.length,
    review: apps.filter(a => a.status === 'review').length,
    accepted: apps.filter(a => a.status === 'accepted').length,
    revenue: apps.reduce((sum, a) => sum + (a.package === 'basic' ? 150 : a.package === 'standard' ? 280 : 450), 0),
  }

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Admin Dashboard</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Hormar.so</div>
          <button onClick={fetchApps} style={{ fontSize: 12, padding: '6px 12px', borderRadius: 8, border: '1px solid var(--border)', background: '#fff', cursor: 'pointer', color: 'var(--teal)' }}>
            ↻ Cusboonaysii
          </button>
        </div>
      </div>

      {/* STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 }}>
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
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
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
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
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

              {/* Files */}
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

              {/* Status update */}
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
