import Link from 'next/link'

export default function Home() {
  const steps = [
    { icon: '👤', title: '1. Account samee', desc: 'Magacaaga, email-kaaga, iyo telefoonka geli. Xor ayay u tahay.' },
    { icon: '💳', title: '2. Package dooro', desc: 'Basic, Standard, ama Premium — xaaladdaada ku habboon ka dooro.' },
    { icon: '📤', title: '3. Documents dir', desc: 'Passport, shahaadooyinka, iyo wixii kale ee loo baahan yahay.' },
    { icon: '🎓', title: '4. Natiijada hel', desc: 'Hormar waxay u gudbisaa jaamacadda. Jawaabta websidka lagaaga sheegi doonaa.' },
  ]
  const stats = [
    { num: '500+', label: 'Arday la gudbiyay' },
    { num: '40+', label: 'Jaamacadood Turkey' },
    { num: '92%', label: 'Qabsi rate' },
    { num: '7 Maalin', label: 'Processing average' },
  ]
  const heroSteps = [
    { num: '✓', label: 'Diiwaan gelinta', sub: 'Account la abuuray', s: 'done' },
    { num: '✓', label: 'Documents la diray', sub: 'Passport, shahaado', s: 'done' },
    { num: '3', label: 'Admin review', sub: 'La xarriyo jaamacadda', s: 'active' },
    { num: '4', label: 'Jaamacadda jawaab', sub: 'Istanbul Üniversitesi', s: 'wait' },
  ]

  return (
    <>
      <section style={{ background: 'var(--teal-light)', padding: '64px 32px 56px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fff', border: '1px solid var(--border)', borderRadius: 20, padding: '4px 14px', fontSize: 12, color: 'var(--teal-dark)', marginBottom: 20 }}>
            📍 Turkey · Somali Students
          </div>
          <h1 style={{ fontSize: 38, fontWeight: 700, lineHeight: 1.25, color: 'var(--teal-dark)', marginBottom: 16 }}>
            Jaamacadaha Turkey<br /><span style={{ color: 'var(--teal)' }}>Fudud ayuu u noqdaa</span>
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 28 }}>
            Hormar waxay kuxiraysaa ardayda Somali ee raba inay Turkey wax ka bartaan jaamacadaha ugu fiican.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link href="/apply" className="btn-primary">Codsi Bilow →</Link>
            <Link href="/packages" className="btn-secondary">Packages Arag</Link>
          </div>
        </div>
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border)', padding: 24, maxWidth: 340, marginLeft: 'auto' }}>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16, fontWeight: 500 }}>📄 Application Status — Axmed Cabdi</p>
          {heroSteps.map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, flexShrink: 0, background: step.s === 'done' ? 'var(--teal-light)' : step.s === 'active' ? 'var(--amber-light)' : 'var(--gray-soft)', color: step.s === 'done' ? 'var(--teal-dark)' : step.s === 'active' ? 'var(--amber)' : 'var(--text-muted)' }}>
                {step.num}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13 }}>{step.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{step.sub}</div>
              </div>
              <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, fontWeight: 500, background: step.s === 'done' ? 'var(--teal-light)' : step.s === 'active' ? 'var(--amber-light)' : 'var(--gray-soft)', color: step.s === 'done' ? 'var(--teal-dark)' : step.s === 'active' ? 'var(--amber)' : 'var(--text-muted)' }}>
                {step.s === 'done' ? 'Dhamays' : step.s === 'active' ? 'Socda' : 'Sugaya'}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, background: 'var(--border)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background: '#fff', padding: 24, textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--teal)', marginBottom: 4 }}>{s.num}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.label}</div>
          </div>
        ))}
      </section>

      <section style={{ background: 'var(--gray-soft)', padding: '56px 32px' }}>
        <div className="section-label">Habka Shaqada</div>
        <div className="section-title">4 Tallaabo oo kaliya</div>
        <div className="section-sub">Fudud, degdeg, la aamin karo</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid var(--border)' }}>
              <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--teal-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 16 }}>{s.icon}</div>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{s.title}</h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ background: 'var(--text)', padding: '40px 32px 24px', color: 'rgba(255,255,255,0.7)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 40, marginBottom: 32 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Hormar.so</div>
            <p style={{ fontSize: 13, lineHeight: 1.6 }}>Ardayda Somali ee raba inay Turkey wax ka bartaan ayaanu kuxirnaa jaamacadaha ugu fiican.</p>
          </div>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 12 }}>Xiriirka</h4>
            <p style={{ fontSize: 13, marginBottom: 6 }}>WhatsApp: +252 61 xxx</p>
            <p style={{ fontSize: 13, marginBottom: 6 }}>Email: info@hormar.so</p>
          </div>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 12 }}>Bogagga</h4>
            <Link href="/packages" style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.7)', textDecoration: 'none', marginBottom: 6 }}>Packages</Link>
            <Link href="/apply" style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Codsi Dir</Link>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 16, display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
          <span>© 2025 Hormar.so — Dhammaan xuquuqda way dhowrsanyihiin</span>
          <span>Mogadishu · Somalia</span>
        </div>
      </footer>
    </>
  )
}
