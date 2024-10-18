import React, { ReactNode, SetStateAction, createContext, useContext, useState } from "react"
import { Category } from "@/common/common-types"
import { initialCategories } from "@/mocks/data"

interface WorkflowContextProps {
    categories: Category[]
    setCategories: (newCategories: Category[]) => void
    isOpenNodePanel: boolean
    setIsOpenNodePanel: (state: boolean) => void
    selectedTabNodePanel: string
    setSelectedTabNodePanel: (tab: string) => void
    isOpenCustomCode: boolean
    setIsOpenCustomCode: (state: boolean) => void
    reset: () => void
}

// Creating the context with a default value of undefined
const WorkflowContext = createContext<WorkflowContextProps | undefined>(undefined)

export const WorkflowProvider = ({ children }: { children: ReactNode }) => {
    const [categories, setCategories] = useState<Category[]>(initialCategories)
    const [isOpenNodePanel, setIsOpenNodePanel] = useState<boolean>(false)
    const [selectedTabNodePanel, setSelectedTabNodePanel] = useState<string>("create")
    const [isOpenCustomCode, setIsOpenCustomCode] = useState<boolean>(false)

    const reset = () => {
        setCategories(initialCategories)
        setIsOpenNodePanel(false)
        setSelectedTabNodePanel("create")
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
                reset,
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
