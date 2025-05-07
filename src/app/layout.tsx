import { Provider } from "@/components/ui/provider"
import { AuthProvider } from "@/contexts/auth.context"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@vercel/analytics/react"

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  return (
    <html suppressHydrationWarning>
      <head>
        <title>Meds</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <AuthProvider>
          <Analytics />
          <Provider><><Toaster />{children}</></Provider>
        </AuthProvider>
      </body>
    </html>
  )
}