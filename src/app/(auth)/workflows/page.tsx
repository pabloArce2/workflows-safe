"use client"

import { useAuth } from "@/context/AuthContext"
import { BackendProvider } from "@/context/BackendContext"
import { WorkflowProvider } from "@/context/WorkflowsContext"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { SidebarProvider } from "@/components/ui/Sidebar/Sidebar"
import { Toaster } from "@/components/ui/Toast/Toaster"
import { TooltipProvider } from "@/components/ui/Tooltip/Tooltip"
import { AppSidebar } from "@/components/AppSidebar/AppSidebar"

import Loader from "./components/Loaders/Loader"
import NoAuth from "./components/Loaders/NoAuth"
import { WorkflowList } from "./components/WorkflowList/WorkflowList"

// Contenedor principal
const MainContent = () => {
    return (
        <div className="flex h-screen w-full">
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
        return <Loader message="Cargando workflows..." />
    }

    if (!user) {
        return <NoAuth message="No autorizado" />
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
