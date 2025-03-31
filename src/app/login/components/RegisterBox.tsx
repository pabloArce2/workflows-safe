import React, { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeftFromLine, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button/Button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/Form/Form"
import { Input } from "@/components/ui/Input/Input"

const registerFormSchema = z
    .object({
        username: z
            .string()
            .min(2, { message: "El nombre de usuario debe tener al menos 2 caracteres." })
            .max(50, { message: "El nombre de usuario no puede exceder 50 caracteres." }),
        email: z.string().email({ message: "Email inválido." }),
        password: z
            .string()
            .min(6, { message: "La contraseña debe tener al menos 6 caracteres." })
            .max(100, { message: "La contraseña no puede exceder 100 caracteres." }),
        confirmPassword: z
            .string()
            .min(6, { message: "La confirmación de contraseña debe tener al menos 6 caracteres." })
            .max(100, { message: "La confirmación de contraseña no puede exceder 100 caracteres." }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Las contraseñas no coinciden.",
        path: ["confirmPassword"],
    })

interface RegisterFormInputs {
    username: string
    email: string
    password: string
    confirmPassword: string
}

interface RegisterBoxProps {
    className?: string
    setIsLoginPage: (isLoginPage: boolean) => void
}

const RegisterBox: React.FC<RegisterBoxProps> = ({ className, setIsLoginPage }) => {
    const form = useForm<RegisterFormInputs>({
        resolver: zodResolver(registerFormSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    const { signUp } = useAuth()
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const onSubmit = async (data: RegisterFormInputs) => {
        setIsLoading(true)
        setError(null)

        if (data.password !== data.confirmPassword) {
            setError("Las contraseñas no coinciden.")
            setIsLoading(false)
            return
        }

        try {
            await signUp(data.email, data.password, { username: data.username })
        } catch (err: any) {
            setError(err.message || "Hubo un problema durante el registro.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={cn(className, "flex flex-col items-center justify-center text-white")}>
            <div className="flex items-center justify-between w-full">
                <div
                    className="rounded-full hover:bg-gray-700 p-3 w-10 h-10 flex items-center justify-center duration-300 cursor-pointer"
                    onClick={() => setIsLoginPage(true)}
                >
                    <ArrowLeftFromLine className="w-6 h-6" />
                </div>
                <div className="flex flex-col items-center justify-center">
                    <h1 className="text-xl font-bold mb-1">Registrarse</h1>
                    <h2 className="text-sm font-light text-center">Crea tu cuenta para continuar</h2>
                </div>
                <div className="w-10" />
            </div>

            <div className="py-2" />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                    {/* Username Field */}
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Nombre de usuario</FormLabel>
                                <FormControl className="w-full">
                                    <Input
                                        className="bg-gray-700 w-full"
                                        placeholder="Ingresa tu nombre de usuario"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage>{form.formState.errors.username?.message}</FormMessage>
                            </FormItem>
                        )}
                    />

                    {/* Email Field */}
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Email</FormLabel>
                                <FormControl className="w-full">
                                    <Input
                                        className="bg-gray-700 w-full"
                                        placeholder="Ingresa tu email"
                                        type="email"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage>{form.formState.errors.email?.message}</FormMessage>
                            </FormItem>
                        )}
                    />

                    {/* Password Field */}
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Contraseña</FormLabel>
                                <FormControl>
                                    <Input
                                        className="bg-gray-700 w-full"
                                        type="password"
                                        placeholder="Ingresa tu contraseña"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage>{form.formState.errors.password?.message}</FormMessage>
                            </FormItem>
                        )}
                    />

                    {/* Confirm Password Field */}
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirmar Contraseña</FormLabel>
                                <FormControl>
                                    <Input
                                        className="bg-gray-700 w-full"
                                        type="password"
                                        placeholder="Confirma tu contraseña"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage>{form.formState.errors.confirmPassword?.message}</FormMessage>
                            </FormItem>
                        )}
                    />

                    {/* Submit Button */}
                    <Button type="submit" className="mt-4 w-full hover:bg-gray-700" disabled={isLoading}>
                        {isLoading && <Loader2 className="animate-spin h-5 w-5 mr-1" viewBox="0 0 24 24" />}
                        Registrarse
                    </Button>
                </form>
            </Form>
            {error && <p className="text-red-500 mt-4">{error}</p>}
            <p className="text-sm font-light text-center pt-4 ">
                Al hacer clic en registrarse, aceptas nuestros Términos de Servicio y Política de Privacidad.
            </p>
        </div>
    )
}

export default RegisterBox
