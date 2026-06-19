import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'Hormar.so — Turkey University Applications',
  description: 'Ardayda Somali ee raba inay Turkey wax ka bartaan ayaanu kuxirnaa jaamacadaha ugu fiican.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="so">
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  )
}
