import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { useWorkflows } from "@/context/WorkflowsContext"
import { ArrowLeft, FolderGit2, LogOut, Plus, User } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/Sidebar/Sidebar"

import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar/Avatar"

export function AppSidebar() {
    const { signOut, user } = useAuth()
    const { workflows, isLoading } = useWorkflows()
    const router = useRouter()
    const pathname = usePathname()
    const isWorkflowsPage = pathname === "/workflows"

    const handleLogout = async () => {
        try {
            await signOut()
        } catch (error) {
            console.error("Error al cerrar sesión:", error)
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }).format(date)
    }

    return (
        <Sidebar className="flex flex-col">
            <SidebarContent className="flex-1">
                <SidebarGroup>
                    <SidebarGroupLabel>Usuario</SidebarGroupLabel>
                    <SidebarGroupContent className="flex gap-2 items-center px-2">
                        <Avatar className="w-10 h-10 border-2 border-neutral-500">
                            <AvatarImage src={user?.user_metadata?.avatar_url} />
                            <AvatarFallback className="">
                                <User className="" />
                            </AvatarFallback>
                        </Avatar>
                        <div className="py-2">
                            <p className="text-sm font-medium">{user?.email}</p>
                            <p className="text-xs text-gray-400">{user?.user_metadata?.username || "Usuario"}</p>
                        </div>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Mis Workflows</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    onClick={() => router.push("/workflows")}
                                    className="w-full flex items-center gap-2 text-blue-500 hover:text-blue-400 hover:bg-blue-500/10"
                                >
                                    <Plus className="w-5 h-5" />
                                    <span>Nuevo Workflow</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            {isLoading ? (
                                <div className="px-4 py-2 text-sm text-gray-500">Cargando workflows...</div>
                            ) : workflows.length === 0 ? (
                                <div className="px-4 py-2 text-sm text-gray-500">No hay workflows</div>
                            ) : (
                                workflows.map((workflow) => (
                                    <SidebarMenuItem key={workflow.id}>
                                        <SidebarMenuButton
                                            onClick={() => router.push(`/workflows/${workflow.id}`)}
                                            className="w-full flex flex-col items-start gap-1 hover:bg-gray-100"
                                        >
                                            <div className="flex items-center gap-2">
                                                <FolderGit2 className="w-4 h-4" />
                                                <span className="font-medium">{workflow.name}</span>
                                            </div>
                                            <span className="text-xs text-gray-500 ml-6">
                                                {formatDate(workflow.created_at)}
                                            </span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))
                            )}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <div className="p-4 border-t border-gray-700">
                <SidebarMenuButton
                    onClick={() => (window.location.href = "/workflows")}
                    disabled={isWorkflowsPage}
                    className={`w-full flex items-center gap-2 mb-2 ${
                        isWorkflowsPage
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-blue-500 hover:text-blue-400 hover:bg-blue-500/10"
                    }`}
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Volver a Workflows</span>
                </SidebarMenuButton>
                <SidebarMenuButton
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Cerrar sesión</span>
                </SidebarMenuButton>
            </div>
        </Sidebar>
    )
}
