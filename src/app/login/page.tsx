"use client"

import { useState } from "react"
import { AuthProvider } from "@/context/AuthContext"

import Box from "./components/Box"
import LoginBox from "./components/LoginBox"
import RegisterBox from "./components/RegisterBox"

const Login: React.FC = () => {
    const [isLoginPage, setIsLoginPage] = useState(true)

    return (
        <AuthProvider>
            <div>
                <div className="flex flex-col items-center justify-center h-screen bg-main-gradient-inverse z-50">
                    <Box className="text-white flex relative my-2 overflow-clip min-h-[600px]">
                        <>
                            <LoginBox
                                setIsLoginPage={setIsLoginPage}
                                className={`${
                                    isLoginPage ? "" : "translate-x-[600px]"
                                } absolute w-3/4 duration-300 z-10`}
                            />
                            <RegisterBox
                                setIsLoginPage={setIsLoginPage}
                                className={`${isLoginPage ? "translate-x-[600px]" : ""} w-3/4 duration-300 z-10`}
                            />
                        </>
                    </Box>
                </div>
            </div>
        </AuthProvider>
    )
}

export default Login
