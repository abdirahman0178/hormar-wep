import Link from 'next/link'
import { PACKAGES } from '@/types'

export default function PackagesPage() {
  const pkgs = Object.entries(PACKAGES)

  return (
    <section style={{ padding: '56px 32px' }}>
      <div className="section-label">Qiimaha</div>
      <div className="section-title">Package ku habboon dooro</div>
      <div className="section-sub">Lacag kasta adeeg u gaar ah. Wax qarsoon majirto.</div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
        {pkgs.map(([key, pkg]) => {
          const isFeatured = key === 'standard'
          return (
            <div key={key} style={{
              background: '#fff',
              border: isFeatured ? '2px solid var(--teal)' : '1px solid var(--border)',
              borderRadius: 12, padding: 24, position: 'relative',
            }}>
              {isFeatured && (
                <div style={{
                  position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                  background: 'var(--teal)', color: '#fff', fontSize: 11,
                  padding: '3px 14px', borderRadius: 10, whiteSpace: 'nowrap',
                }}>
                  Ugu badan la isticmaalo
                </div>
              )}
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 4 }}>{pkg.name}</div>
              <div style={{ fontSize: 32, fontWeight: 700, marginBottom: 4 }}>
                ${pkg.price}{' '}
                <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--text-muted)' }}>hal codsi</span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.5 }}>
                Max {pkg.maxUnis} jaamacadood · {pkg.days} maalin processing
              </div>
              <ul style={{ listStyle: 'none', marginBottom: 24 }}>
                {pkg.features.map((f, i) => (
                  <li key={i} style={{
                    fontSize: 13, padding: '6px 0', display: 'flex', alignItems: 'center', gap: 8,
                    borderBottom: i < pkg.features.length - 1 ? '1px solid var(--border)' : 'none',
                  }}>
                    <span style={{ color: 'var(--teal)' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/apply" style={{
                display: 'block', width: '100%', padding: 10, borderRadius: 8,
                fontSize: 14, fontWeight: 500, cursor: 'pointer', textAlign: 'center',
                textDecoration: 'none',
                background: isFeatured ? 'var(--teal)' : 'transparent',
                color: isFeatured ? '#fff' : 'var(--text)',
                border: isFeatured ? 'none' : '1px solid var(--border)',
              }}>
                Bilow
              </Link>
            </div>
          )
        })}
      </div>
    </section>
  )
}
