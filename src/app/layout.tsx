import { Provider } from "@/components/ui/provider"
import { AuthProvider, useAuth } from "@/contexts/auth.context"
import { Toaster } from "@/components/ui/toaster"

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  return (
    <html suppressHydrationWarning>
      <body>
        <AuthProvider>
          <Provider><><Toaster />{children}</></Provider>
        </AuthProvider>
      </body>
    </html>
  )
}