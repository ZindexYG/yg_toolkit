import './globals.css'
import React from 'react'

export const metadata = {
  title: 'yg_toolkit - Next.js Migration',
  description: 'Next.js 16 skeleton for migration'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <header style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>
          <h1 style={{ margin: 0 }}>yg_toolkit</h1>
        </header>
        <div style={{ display: 'flex', minHeight: 'calc(100vh - 56px)' }}>
          <aside style={{ width: 240, borderRight: '1px solid #e5e7eb', padding: 16 }}>
            <nav>
              <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
                <li><a href="/">首页</a></li>
                <li><a href="/dashboard">Dashboard</a></li>
              </ul>
            </nav>
          </aside>
          <main style={{ flex: 1, padding: 16 }}>{children}</main>
        </div>
      </body>
    </html>
  )
}
