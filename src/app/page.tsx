"use client"

//test
import { useEffect } from "react"
import { redirect } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

import Loader from "./(auth)/workflows/components/Loaders/Loader"

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

    return <Loader message="Cargando..." />
}
