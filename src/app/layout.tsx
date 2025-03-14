import type { Metadata } from "next"
import { Inter } from "next/font/google"

import "@/styles/globals.css"
import { AuthProvider } from "@/context/AuthContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "Workflows app",
    description: "An app to create workflows",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="es">
            <body className={inter.className}>
                <AuthProvider>{children}</AuthProvider>
            </body>
        </html>
    )
}
