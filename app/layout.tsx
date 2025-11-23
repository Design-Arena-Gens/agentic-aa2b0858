import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Chat Automation Template - n8n Style',
  description: 'Generate AI chat conversations using free image models',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
