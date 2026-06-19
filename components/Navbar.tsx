'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const path = usePathname()

  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 32px', background: '#fff', borderBottom: '1px solid var(--border)',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <Link href="/" style={{ fontSize: 20, fontWeight: 700, color: 'var(--teal)', textDecoration: 'none' }}>
        Hormar<span style={{ color: 'var(--text)' }}>.so</span>
      </Link>

      <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
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

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <Link href="/admin" style={{
          fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none',
          padding: '6px 12px', borderRadius: 6,
          background: path === '/admin' ? 'var(--gray-soft)' : 'transparent',
        }}>
          🔒 Admin
        </Link>
        <Link href="/apply" className="btn-primary">
          Hada Bilow →
        </Link>
      </div>
    </nav>
  )
}
