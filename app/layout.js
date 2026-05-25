import './globals.css'

export const metadata = {
  title: 'AI Code Reviewer',
  description: 'Automated code quality analysis — detect issues and improvement opportunities',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <div className="container">
          <header>
            <h1>AI Code Reviewer</h1>
            <p className="subtitle">Automated code quality analysis — detect issues and improvement opportunities</p>
          </header>
          <main>{children}</main>
          <footer>Powered by MiMo AI &mdash; 100T Token Grant Program</footer>
        </div>
      </body>
    </html>
  )
}