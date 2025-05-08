"use client"

import { useAuth } from "@/context/AuthContext"
import { BackendProvider } from "@/context/BackendContext"
import { WorkflowProvider } from "@/context/WorkflowsContext"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { SidebarProvider } from "@/components/ui/Sidebar/Sidebar"
import { Toaster } from "@/components/ui/Toast/Toaster"
import { TooltipProvider } from "@/components/ui/Tooltip/Tooltip"
import { AppSidebar } from "@/components/AppSidebar/AppSidebar"

import { WorkflowList } from "./components/WorkflowList/WorkflowList"

// Contenedor principal
const MainContent = () => {
    return (
        <div className="flex h-screen">
            <AppSidebar />
            <main className="flex-1 overflow-auto">
                <WorkflowList />
            </main>
        </div>
    )
}

// Componente de página
export default function WorkflowsListPage() {
    const queryClient = new QueryClient()
    const { user, loading } = useAuth()

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Cargando...</div>
    }

    if (!user) {
        return <div className="flex justify-center items-center h-screen">No autorizado</div>
    }

    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <BackendProvider>
                    <WorkflowProvider>
                        <SidebarProvider defaultOpen={true}>
                            <MainContent />
                            <Toaster />
                        </SidebarProvider>
                    </WorkflowProvider>
                </BackendProvider>
            </TooltipProvider>
        </QueryClientProvider>
    )
}
