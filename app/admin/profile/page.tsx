'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? '').split(',').map(e => e.trim()).filter(Boolean)

export default function AdminProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [form, setForm] = useState({
    full_name: '',
    role: 'Admin',
    phone: '',
    bio: '',
  })

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user || (ADMIN_EMAILS.length > 0 && !ADMIN_EMAILS.includes(user.email ?? ''))) {
        router.replace('/admin')
        return
      }
      setUser(user)

      // Pre-fill name from Google
      const googleName = user.user_metadata?.full_name ?? user.user_metadata?.name ?? ''

      // Load existing profile
      const { data } = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (data) {
        setForm({
          full_name: data.full_name ?? googleName,
          role: data.role ?? 'Admin',
          phone: data.phone ?? '',
          bio: data.bio ?? '',
        })
      } else {
        setForm(prev => ({ ...prev, full_name: googleName }))
      }

      setLoading(false)
    })
  }, [router])

  async function saveProfile() {
    if (!user) return
    setSaving(true)
    setSaved(false)

    const { error } = await supabase.from('admin_profiles').upsert({
      id: user.id,
      full_name: form.full_name,
      role: form.role,
      phone: form.phone,
      bio: form.bio,
      updated_at: new Date().toISOString(),
    })

    setSaving(false)
    if (!error) setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--text-muted)' }}>Waa la rarayo...</div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 24px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <Link href="/admin" style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
          ← Dashboard
        </Link>
        <span style={{ color: 'var(--border)' }}>|</span>
        <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Profile-kaaga</h1>
      </div>

      {/* Avatar + basic info */}
      <div style={{ background: 'var(--teal-dark)', borderRadius: 16, padding: 28, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          {user?.user_metadata?.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt=""
              style={{ width: 72, height: 72, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.3)' }}
            />
          ) : (
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, color: '#fff' }}>
              {form.full_name?.charAt(0) ?? '?'}
            </div>
          )}
          <div style={{ position: 'absolute', bottom: 2, right: 2, width: 14, height: 14, borderRadius: '50%', background: '#4ade80', border: '2px solid var(--teal-dark)' }} />
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
            {form.full_name || 'Admin'}
          </div>
          <div style={{ fontSize: 13, color: '#9FE1CB', marginBottom: 4 }}>{form.role}</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{user?.email}</div>
        </div>
      </div>

      {/* Form */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 16, padding: 28 }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 24, color: 'var(--text)' }}>Macluumaadka Shakhsi</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)' }}>Magaca buuxa</label>
            <input
              type="text"
              value={form.full_name}
              onChange={e => setForm({ ...form, full_name: e.target.value })}
              placeholder="Magacaaga"
              style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '10px 12px', fontSize: 14, outline: 'none', width: '100%' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)' }}>Jabaha (Role)</label>
            <select
              value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value })}
              style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '10px 12px', fontSize: 14, outline: 'none', width: '100%', background: '#fff' }}
            >
              <option>Admin</option>
              <option>Manager</option>
              <option>Xoghaye</option>
              <option>Taageere</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)' }}>Email</label>
            <input
              type="email"
              value={user?.email ?? ''}
              readOnly
              style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '10px 12px', fontSize: 14, outline: 'none', width: '100%', background: 'var(--gray-soft)', color: 'var(--text-muted)', cursor: 'default' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)' }}>Telefoon (WhatsApp)</label>
            <input
              type="tel"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              placeholder="+252 61 xxx xxxx"
              style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '10px 12px', fontSize: 14, outline: 'none', width: '100%' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 24 }}>
          <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)' }}>Faahfaahin (Bio)</label>
          <textarea
            value={form.bio}
            onChange={e => setForm({ ...form, bio: e.target.value })}
            placeholder="Xoghayaha Hormar — waxaan ka shaqeeyaa..."
            rows={3}
            style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '10px 12px', fontSize: 14, outline: 'none', width: '100%', resize: 'vertical', fontFamily: 'inherit' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={saveProfile}
            disabled={saving}
            className="btn-primary"
            style={{ opacity: saving ? 0.7 : 1 }}
          >
            {saving ? 'Waa la keydsanayaa...' : 'Keydi →'}
          </button>
          {saved && (
            <span style={{ fontSize: 13, color: 'var(--teal)', fontWeight: 500 }}>✓ La keydsaday!</span>
          )}
        </div>
      </div>

      {/* Sign out */}
      <div style={{ marginTop: 24, padding: 20, border: '1px solid #FCEBEB', borderRadius: 12, background: '#fff' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#791F1F', marginBottom: 6 }}>Ka bax</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>Account-kaaga ka bax websidkan.</div>
        <button
          onClick={() => supabase.auth.signOut().then(() => window.location.replace('/admin'))}
          style={{ padding: '8px 18px', borderRadius: 8, border: '1px solid #FCEBEB', background: '#FCEBEB', color: '#791F1F', fontSize: 13, cursor: 'pointer', fontWeight: 500 }}
        >
          Ka bax
        </button>
      </div>
    </div>
  )
}
