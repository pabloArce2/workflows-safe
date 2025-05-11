import { WorkflowIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface LoaderProps {
    message: string
    className?: string
}

export default function Loader({ message, className }: LoaderProps) {
    return (
        <div
            className={cn("flex flex-col items-center justify-center h-screen w-full", className)}
            style={{
                backgroundImage: 'url("/workflows_bg.png")',
                backgroundRepeat: "repeat",
                backgroundSize: "auto",
            }}
        >
            <div className="flex flex-col items-center justify-center">
                <div className="w-64 h-64 relative">
                    <style jsx>{`
                        @keyframes spin {
                            0% {
                                transform: rotate(0deg);
                            }
                            25% {
                                transform: rotate(90deg);
                            }
                            50% {
                                transform: rotate(180deg);
                            }
                            75% {
                                transform: rotate(270deg);
                            }
                            100% {
                                transform: rotate(360deg);
                            }
                        }
                        @keyframes float {
                            0%,
                            100% {
                                transform: translateY(0);
                            }
                            50% {
                                transform: translateY(-10px);
                            }
                        }
                        .spinning-icon {
                            animation: spin 2s infinite ease-in-out;
                        }
                        .floating-icon {
                            animation: float 3s infinite ease-in-out;
                        }
                    `}</style>
                    <div className="spinning-icon floating-icon">
                        <WorkflowIcon className="w-full h-full text-gray-900 animate-pulse" />
                    </div>
                </div>
                <p className="text-gray-900 mt-4 text-xl font-medium">{message}</p>
            </div>
        </div>
    )
}
