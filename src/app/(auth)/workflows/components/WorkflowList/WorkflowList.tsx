"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useWorkflows } from "@/context/WorkflowsContext"

export const WorkflowList = () => {
    const router = useRouter()
    const { workflows, isLoading, error, createNewWorkflow, deleteWorkflow } = useWorkflows()
    const [newWorkflowName, setNewWorkflowName] = useState("")
    const [isCreating, setIsCreating] = useState(false)

    const handleCreateWorkflow = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newWorkflowName.trim()) return

        try {
            setIsCreating(true)
            const newWorkflow = await createNewWorkflow(newWorkflowName)
            router.push(`/workflows/${newWorkflow.id}`)
        } catch (error) {
            console.error("Error al crear el workflow:", error)
        } finally {
            setIsCreating(false)
            setNewWorkflowName("")
        }
    }

    const handleDeleteWorkflow = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        if (confirm("¿Estás seguro de que deseas eliminar este workflow?")) {
            try {
                await deleteWorkflow(id)
            } catch (error) {
                console.error("Error al eliminar el workflow:", error)
            }
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date)
    }

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-6">Mis Workflows</h1>

                <form onSubmit={handleCreateWorkflow} className="flex gap-2 mb-8">
                    <input
                        type="text"
                        placeholder="Nombre del nuevo workflow"
                        value={newWorkflowName}
                        onChange={(e) => setNewWorkflowName(e.target.value)}
                        className="px-4 py-2 border rounded-md flex-1"
                    />
                    <button
                        type="submit"
                        disabled={isCreating || !newWorkflowName.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
                    >
                        {isCreating ? "Creando..." : "Crear Nuevo"}
                    </button>
                </form>
            </div>

            {isLoading ? (
                <div className="text-center py-8">Cargando workflows...</div>
            ) : error ? (
                <div className="text-red-500 p-4 border border-red-300 rounded-md bg-red-50">
                    Error al cargar los workflows: {error.message}
                </div>
            ) : workflows.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    No tienes workflows todavía. Crea uno nuevo para empezar.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {workflows.map((workflow) => (
                        <div
                            key={workflow.id}
                            onClick={() => router.push(`/workflows/${workflow.id}`)}
                            className="border rounded-md p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-lg">{workflow.name}</h3>
                                <button
                                    onClick={(e) => handleDeleteWorkflow(workflow.id, e)}
                                    className="text-red-500 hover:text-red-700 transition-colors"
                                >
                                    Eliminar
                                </button>
                            </div>
                            <div className="text-sm text-gray-500">Creado: {formatDate(workflow.created_at)}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
