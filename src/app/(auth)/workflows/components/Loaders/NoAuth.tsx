import { Link2Off } from "lucide-react"

interface NoAuthProps {
    message: string
}

export default function NoAuth({ message }: NoAuthProps) {
    return (
        <div
            className="flex flex-col items-center justify-center h-screen w-full"
            style={{
                backgroundImage: 'url("/workflows_bg.png")',
                backgroundRepeat: "repeat",
                backgroundSize: "auto",
            }}
        >
            <div className="flex flex-col items-center justify-center">
                <div className="w-64 h-64 relative">
                    <Link2Off className="w-full h-full text-gray-900" />
                </div>
                <p className="text-gray-900 text-xl font-medium">{message}</p>
            </div>
        </div>
    )
}
