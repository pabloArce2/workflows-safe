import type { Metadata } from "next"
import { Inter } from "next/font/google"

import "@/styles/globals.css"
import { cookies } from "next/headers"
import { notFound, redirect } from "next/navigation"
import { createServerClient } from "@supabase/ssr"

export const metadata: Metadata = {
    title: "Workflows app",
    description: "An app to create workflows",
}

const inter = Inter({ subsets: ["latin"] })
const locales = ["en", "es"]

// export function generateStaticParams() {
//   return locales.map((locale) => ({ locale }))
// }

interface RootLayoutProps {
    children: React.ReactNode
    params: {
        locale: string
    }
}

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = cookies()

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
            },
        }
    )

    const {
        data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
        redirect("/login")
    }

    return <>{children}</>
}
