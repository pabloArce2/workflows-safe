"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useWorkflows } from "@/context/WorkflowsContext"

import { Button } from "@/components/ui/Button/Button"
import { Input } from "@/components/ui/Input/Input"

import { WorkflowPreview } from "./WorkflowPreview/WorkflowPreview"

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
        <div className="bg-neutral-50 flex flex-col h-full w-full">
            <div className="px-8 pt-8 w-full">
                <h1 className="text-3xl font-bold mb-6">Mis Workflows</h1>

                <form onSubmit={handleCreateWorkflow} className="flex items-center gap-2 mb-8 max-w-[800px]">
                    <Input
                        type="text"
                        placeholder="Nombre del nuevo workflow"
                        value={newWorkflowName}
                        onChange={(e) => setNewWorkflowName(e.target.value)}
                        className="px-4 py-2 border rounded-md flex-1"
                    />
                    <Button
                        type="submit"
                        disabled={isCreating || !newWorkflowName.trim()}
                        className="px-4 py-5 bg-gray-900 text-white rounded-md disabled:opacity-50"
                    >
                        {isCreating ? "Creando..." : "Crear Nuevo"}
                    </Button>
                </form>
            </div>
            <hr className="w-full" />
            <div className="flex-1 overflow-auto">
                <div
                    className="w-full h-full px-8 pt-8"
                    style={{
                        //backgroundImage: 'url("/workflows_bg.png")',
                        backgroundRepeat: "repeat",
                        backgroundSize: "auto",
                    }}
                >
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-10">
                            {workflows.map((workflow) => (
                                <WorkflowPreview
                                    key={workflow.id}
                                    id={workflow.id}
                                    name={workflow.name}
                                    createdAt={formatDate(workflow.created_at)}
                                    onClick={() => router.push(`/workflows/${workflow.id}`)}
                                    onDelete={deleteWorkflow}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
