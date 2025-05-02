import { Provider } from "@/components/ui/provider"
import { AuthProvider, useAuth } from "@/contexts/auth.context"
import { Toaster } from "@/components/ui/toaster"

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
          <Provider><><Toaster />{children}</></Provider>
        </AuthProvider>
      </body>
    </html>
  )
}