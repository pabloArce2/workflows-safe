import { useState } from "react"
import Image from "next/image"
import { Trash2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button/Button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/Dialog/Dialog"

interface WorkflowPreviewProps {
    className?: string
    name: string
    createdAt: string
    id: string
    onDelete: (id: string) => Promise<void>
    onClick?: () => void
}

export const WorkflowPreview = ({ className, name, createdAt, id, onDelete, onClick }: WorkflowPreviewProps) => {
    const [isTrashHovered, setIsTrashHovered] = useState(false)
    const [isTrashPressed, setIsTrashPressed] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const handleDelete = async () => {
        try {
            await onDelete(id)
            setIsDialogOpen(false)
        } catch (error) {
            console.error("Error al eliminar el workflow:", error)
        }
    }

    return (
        <>
            <div
                className={cn(
                    "border rounded-md p-4 cursor-pointer transition-colors bg-white border-gray-300",
                    !isTrashHovered && !isTrashPressed && "hover:bg-gray-50",
                    className
                )}
                onClick={onClick}
            >
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-lg">{name}</h3>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <div
                                className={cn(
                                    "flex items-center p-1 rounded-md transition-all duration-200",
                                    isTrashHovered ? "bg-red-50" : "",
                                    isTrashPressed ? "bg-red-100 scale-95" : ""
                                )}
                                onClick={(e) => e.stopPropagation()}
                                onMouseEnter={() => setIsTrashHovered(true)}
                                onMouseLeave={() => {
                                    setIsTrashHovered(false)
                                    setIsTrashPressed(false)
                                }}
                                onMouseDown={() => setIsTrashPressed(true)}
                                onMouseUp={() => setIsTrashPressed(false)}
                            >
                                <Trash2
                                    className={cn(
                                        "transition-colors duration-200",
                                        isTrashHovered ? "text-red-600" : "text-red-500"
                                    )}
                                    size={16}
                                />
                            </div>
                        </DialogTrigger>
                        <DialogContent
                            onInteractOutside={(e) => e.preventDefault()}
                            className="sm:max-w-[425px] p-6"
                        >
                            <DialogHeader>
                                <DialogTitle>Eliminar Workflow</DialogTitle>
                                <DialogDescription className="space-y-2">
                                    <p>¿Estás seguro de que deseas eliminar el workflow "{name}"?</p>
                                    <p className="text-red-500">
                                        Esta acción no se puede deshacer. Se eliminará de manera permanente toda la
                                        información asociada a este workflow, incluyendo:
                                    </p>
                                    <ul className="list-disc pl-4 text-sm">
                                        <li>Todos los nodos y conexiones</li>
                                        <li>Configuraciones y parámetros</li>
                                        <li>Historial de ejecuciones</li>
                                        <li>Datos asociados</li>
                                    </ul>
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="flex gap-2 sm:gap-0">
                                <Button
                                    variant="outline"
                                    onClick={(e) => {
                                        setIsDialogOpen(false)
                                    }}
                                >
                                    Cancelar
                                </Button>
                                <Button variant="destructive" onClick={handleDelete}>
                                    Eliminar
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="w-full h-48 relative mb-2">
                    <Image
                        src="/workflows_bg.png"
                        alt="Workflow Preview"
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover rounded-md"
                    />
                </div>
                <div className="text-sm text-gray-500">Creado: {createdAt}</div>
            </div>
        </>
    )
}
