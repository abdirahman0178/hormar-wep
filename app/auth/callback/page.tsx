'use client'
import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

function Callback() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/apply'
    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(() => {
        router.replace(next)
      })
    } else {
      router.replace(next)
    }
  }, [router, searchParams])

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 36 }}>⏳</div>
      <div style={{ color: 'var(--text-muted)', fontSize: 15 }}>Waa la geleynayaa...</div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--text-muted)' }}>Sugaya...</div>
      </div>
    }>
      <Callback />
    </Suspense>
  )
}
