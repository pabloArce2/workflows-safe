// context/AuthContext.tsx
import { ReactNode, createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/router"
import { SupabaseClient, User } from "@supabase/supabase-js"

import { createClient } from "../utils/supabase/client"

interface AuthContextType {
    user: User | null
    loading: boolean
    signIn: (email: string, password: string) => Promise<any>
    signUp: (email: string, password: string) => Promise<any>
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

interface AuthProviderProps {
    children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const router = useRouter()

    useEffect(() => {
        const supabase = createClient()

        const getSession = async () => {
            const {
                data: { session },
                error,
            } = await supabase.auth.getSession()

            if (session) {
                setUser(session.user)
            } else if (error) {
                console.error("Error fetching session:", error)
            }

            setLoading(false)
        }

        const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === "SIGNED_IN") {
                setUser(session?.user || null)
            } else if (event === "SIGNED_OUT") {
                setUser(null)
            }
        })

        getSession()

        return () => {
            subscription.subscription.unsubscribe()
        }
    }, [])

    const signIn = async (email: string, password: string): Promise<any> => {
        const supabase = createClient()
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        setUser(data.user)
        return data
    }

    const signUp = async (email: string, password: string): Promise<any> => {
        const supabase = createClient()
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        return data
    }

    const signOut = async (): Promise<void> => {
        const supabase = createClient()
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        setUser(null)
        router.push("/") // Redirige al inicio tras cerrar sesión
    }

    const value: AuthContextType = {
        user,
        loading,
        signIn,
        signUp,
        signOut,
    }

    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext)
    if (context === null) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
