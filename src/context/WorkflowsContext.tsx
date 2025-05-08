import React, { ReactNode, createContext, useContext, useEffect, useState } from "react"
import { Category } from "@/common/common-types"
import { initialCategories } from "@/mocks/data"
import workflowService, { Workflow, WorkflowData } from "@/services/workflows"
import { useQuery, useQueryClient } from "@tanstack/react-query"

import { useAuth } from "./AuthContext"

interface WorkflowContextProps {
    categories: Category[]
    setCategories: (newCategories: Category[]) => void
    isOpenNodePanel: boolean
    setIsOpenNodePanel: (state: boolean) => void
    selectedTabNodePanel: string
    setSelectedTabNodePanel: (tab: string) => void
    isOpenCustomCode: boolean
    setIsOpenCustomCode: (state: boolean) => void
    isTabMenuMax: boolean
    setIsTabMenuMax: (state: boolean) => void
    reset: () => void
    trampita: boolean
    setTrampita: (state: boolean) => void
    // Nuevas propiedades para workflows
    workflows: Workflow[]
    isLoading: boolean
    error: Error | null
    currentWorkflow: WorkflowData | null
    refreshWorkflows: () => void
    createNewWorkflow: (name: string) => Promise<Workflow>
    loadWorkflow: (id: string) => Promise<WorkflowData>
    saveWorkflow: (workflowId: string, nodes: any[], edges: any[], viewport: any) => Promise<void>
    updateWorkflowName: (id: string, name: string) => Promise<void>
    deleteWorkflow: (id: string) => Promise<void>
}

// Creating the context with a default value of undefined
const WorkflowContext = createContext<WorkflowContextProps | undefined>(undefined)

export const WorkflowProvider = ({ children }: { children: ReactNode }) => {
    const [categories, setCategories] = useState<Category[]>(initialCategories)
    const [isOpenNodePanel, setIsOpenNodePanel] = useState<boolean>(false)
    const [selectedTabNodePanel, setSelectedTabNodePanel] = useState<string>("create")
    const [isOpenCustomCode, setIsOpenCustomCode] = useState<boolean>(false)
    const [isTabMenuMax, setIsTabMenuMax] = useState<boolean>(false)
    const [trampita, setTrampita] = useState<boolean>(false)
    const [currentWorkflow, setCurrentWorkflow] = useState<WorkflowData | null>(null)

    const { user } = useAuth()
    const queryClient = useQueryClient()

    const reset = () => {
        setCategories(initialCategories)
        setIsOpenNodePanel(false)
        setSelectedTabNodePanel("create")
        setTrampita(false)
    }

    // Consulta para obtener todos los workflows del usuario
    const {
        data: workflows = [],
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ["workflows", user?.id],
        queryFn: () => (user?.id ? workflowService.getUserWorkflows(user.id) : Promise.resolve([])),
        enabled: !!user?.id,
        staleTime: 1000 * 60 * 5, // 5 minutos
    })

    const refreshWorkflows = () => {
        queryClient.invalidateQueries({ queryKey: ["workflows"] })
    }

    // Crear un nuevo workflow
    const createNewWorkflow = async (name: string): Promise<Workflow> => {
        if (!user?.id) throw new Error("Usuario no autenticado")
        const newWorkflow = await workflowService.createWorkflow(name, user.id)
        refreshWorkflows()
        return newWorkflow
    }

    // Cargar un workflow específico
    const loadWorkflow = async (id: string): Promise<WorkflowData> => {
        if (!user?.id) throw new Error("Usuario no autenticado")
        try {
            const workflowData = await workflowService.getWorkflowById(id, user.id)
            setCurrentWorkflow(workflowData)
            return workflowData
        } catch (error) {
            console.error("Error al cargar el workflow:", error)
            throw error
        }
    }

    // Guardar cambios en un workflow
    const saveWorkflow = async (workflowId: string, nodes: any[], edges: any[], viewport: any): Promise<void> => {
        try {
            await workflowService.saveWorkflowData(workflowId, nodes, edges, viewport)
            refreshWorkflows()
        } catch (error) {
            console.error("Error al guardar el workflow:", error)
            throw error
        }
    }

    // Actualizar nombre del workflow
    const updateWorkflowName = async (id: string, name: string): Promise<void> => {
        if (!user?.id) throw new Error("Usuario no autenticado")
        await workflowService.updateWorkflowName(id, name, user.id)
        refreshWorkflows()
    }

    // Eliminar un workflow
    const deleteWorkflow = async (id: string): Promise<void> => {
        if (!user?.id) throw new Error("Usuario no autenticado")
        await workflowService.deleteWorkflow(id, user.id)
        refreshWorkflows()
    }

    return (
        <WorkflowContext.Provider
            value={{
                categories,
                setCategories,
                isOpenNodePanel,
                setIsOpenNodePanel,
                selectedTabNodePanel,
                setSelectedTabNodePanel,
                isOpenCustomCode,
                setIsOpenCustomCode,
                isTabMenuMax,
                setIsTabMenuMax,
                reset,
                trampita,
                setTrampita,
                // Nuevas propiedades
                workflows,
                isLoading,
                error: error as Error | null,
                currentWorkflow,
                refreshWorkflows,
                createNewWorkflow,
                loadWorkflow,
                saveWorkflow,
                updateWorkflowName,
                deleteWorkflow,
            }}
        >
            {children}
        </WorkflowContext.Provider>
    )
}

// Custom hook to use the Workflow context
export const useWorkflows = () => {
    const context = useContext(WorkflowContext)
    if (!context) {
        throw new Error("useWorkflows must be used within a WorkflowProvider")
    }
    return context
}
