export const metadata = {
  title: 'Neo4D Live',
  description: 'High Performance Live Engine',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}