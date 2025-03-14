import { supabase } from "../lib/supabaseClient"

// Función para registrar un usuario
export async function registerUser(email: string, password: string) {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        })

        if (error) {
            throw new Error(`Error en el registro: ${error.message}`)
        }

        return { user: data.user }
    } catch (error) {
        console.error(error)
        throw new Error("Hubo un problema durante el registro.")
    }
}

// Función para iniciar sesión
export async function loginUser(email: string, password: string) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            throw new Error(`Error al iniciar sesión: ${error.message}`)
        }

        return { user: data.user }
    } catch (error) {
        console.error(error)
        throw new Error("Hubo un problema durante el inicio de sesión.")
    }
}

// Función para cerrar sesión
export async function logoutUser() {
    const { error } = await supabase.auth.signOut()

    if (error) {
        throw new Error(`Error al cerrar sesión: ${error.message}`)
    }

    return "Sesión cerrada correctamente."
}
