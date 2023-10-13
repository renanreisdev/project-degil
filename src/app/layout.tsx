import { Header } from '@/components/Header'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Footer } from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Degil Engenharia',
  description: 'Degil Engenharia, serviços de Regularização de residências e comércios.'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={`w-screen max-w-screen-xl m-auto bg-slate-200 ${inter.className}`}>
        <div className="flex flex-col h-screen pt-[84px]">
          {children}
          <Footer />
        </div>
      </body>
    </html >
  )
}
