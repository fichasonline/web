import type React from "react"
import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import { Toaster } from "sonner"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Finex — Seguridad y confianza en cada movimiento",
  description:
    "Tu solución integral para intercambios digitales. Especialistas en fichas de póker, criptomonedas y gaming online.",
  generator: "v0.app",
  alternates: {
    canonical: "https://finex.example/",
  },
  openGraph: {
    siteName: "Finex",
    title: "Seguridad y confianza en cada movimiento | Finex",
    description:
      "Tu solución integral para intercambios digitales. Especialistas en fichas de póker, criptomonedas y gaming online.",
    type: "website",
    url: "https://finex.example/",
    locale: "es_AR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Seguridad y confianza en cada movimiento | Finex",
    description:
      "Tu solución integral para intercambios digitales. Especialistas en fichas de póker, criptomonedas y gaming online.",
    site: "@finex",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${poppins.variable} antialiased`}>
      <body className="font-sans bg-neutral-50 text-neutral-900 overflow-x-hidden">
        <Toaster position="top-right" richColors />
        {children}
      </body>
    </html>
  )
}
