import type { Metadata } from "next"
import { Inter } from "next/font/google"

import "@/styles/globals.css"
import { notFound } from "next/navigation"
import { unstable_setRequestLocale } from "next-intl/server"

export const metadata: Metadata = {
  title: "Workflows app",
  description: "An app to create workflows",
}

const inter = Inter({ subsets: ["latin"] })

const locales = ["en", "es"]

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

interface LocaleLayoutProps {
  children: React.ReactNode
  params: {
    locale: string
  }
}

export default async function LocaleLayout({ children, params: { locale } }: LocaleLayoutProps) {
  let messages
  try {
    messages = (await import(`@/messages/${locale}.json`)).default
  } catch (error) {
    notFound()
  }

  const isValidLocale = locales.some((cur) => cur === locale)
  if (!isValidLocale) notFound()

  unstable_setRequestLocale(locale)

  return (
    <html lang={locale}>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
