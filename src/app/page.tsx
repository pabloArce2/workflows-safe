// src/app/page.tsx

import { useEffect } from "react"
import { redirect } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

interface HomeParams {
    params: {
        locale: string
    }
}

export default function Home({ params: { locale } }: HomeParams) {
    const { user, loading } = useAuth()

    useEffect(() => {
        if (!loading) {
            if (user) {
                redirect(`${locale}/workflows`)
            } else {
                redirect(`${locale}/login`)
            }
        }
    }, [user, loading, locale])

    return <div>Loading...</div> // Muestra un loader mientras se verifica el estado
}
