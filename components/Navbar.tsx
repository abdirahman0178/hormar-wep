'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function Navbar() {
  const path = usePathname()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 24px', background: '#fff', borderBottom: '1px solid var(--border)',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <Link href="/" style={{ fontSize: 20, fontWeight: 700, color: 'var(--teal)', textDecoration: 'none', flexShrink: 0 }}>
        Hormar<span style={{ color: 'var(--text)' }}>.so</span>
      </Link>

      {/* Desktop nav */}
      <div className="nav-links" style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
        {[
          { href: '/', label: 'Hoyga' },
          { href: '/packages', label: 'Packages' },
          { href: '/apply', label: 'Apply' },
        ].map(({ href, label }) => (
          <Link key={href} href={href} style={{
            fontSize: 14,
            color: path === href ? 'var(--teal)' : 'var(--text-muted)',
            textDecoration: 'none',
            fontWeight: path === href ? 600 : 400,
          }}>
            {label}
          </Link>
        ))}
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {user ? (
          <>
            <Link href="/admin" className="nav-admin-link" style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none', padding: '6px 12px', borderRadius: 6, background: path === '/admin' ? 'var(--gray-soft)' : 'transparent' }}>
              🔒 Admin
            </Link>
            {user.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt=""
                title={user.email ?? ''}
                style={{ width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', border: '2px solid var(--border)' }}
                onClick={() => supabase.auth.signOut().then(() => window.location.reload())}
              />
            ) : (
              <button
                onClick={() => supabase.auth.signOut().then(() => window.location.reload())}
                style={{ fontSize: 13, color: 'var(--text-muted)', background: 'var(--gray-soft)', border: 'none', padding: '6px 12px', borderRadius: 6, cursor: 'pointer' }}
              >
                Bax
              </button>
            )}
          </>
        ) : (
          <>
            <Link href="/admin" className="nav-admin-link" style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none', padding: '6px 12px', borderRadius: 6 }}>
              🔒 Admin
            </Link>
            <Link href="/apply" className="btn-primary">
              Hada Bilow →
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
