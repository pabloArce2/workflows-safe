"use client"

//test
import { useEffect } from "react"
import { redirect, useParams } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

import Loader from "./(auth)/workflows/components/Loaders/Loader"

interface HomeParams {
    params: {
        locale: string
    }
}

export default function Home({ params: { locale } }: HomeParams) {
    const { user, loading } = useAuth()
    const params = useParams()
    const workflowId = params.workflowId as string

    useEffect(() => {
        console.log("workflowId", workflowId)
        if (!loading) {
            if (user) {
                redirect(`${locale}/workflows`)
            } else if (workflowId) {
                redirect(`${locale}/workflows/${workflowId}`)
            } else {
                redirect(`${locale}/login`)
            }
        }
    }, [user, loading, locale])

    return <Loader message="Cargando..." />
}
