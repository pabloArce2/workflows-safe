import { useAuth } from "@/context/AuthContext"
import { ArrowLeft, Calendar, Home, Inbox, LogOut, Search, Settings } from "lucide-react"

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

// Menu items.
const items = [
    {
        title: "Home",
        url: "#",
        icon: Home,
    },
    {
        title: "Inbox",
        url: "#",
        icon: Inbox,
    },
    {
        title: "Calendar",
        url: "#",
        icon: Calendar,
    },
    {
        title: "Search",
        url: "#",
        icon: Search,
    },
    {
        title: "Settings",
        url: "#",
        icon: Settings,
    },
]

export function AppSidebar() {
    const { signOut } = useAuth()

    const handleLogout = async () => {
        try {
            await signOut()
        } catch (error) {
            console.error("Error al cerrar sesión:", error)
        }
    }

    return (
        <Sidebar className="flex flex-col">
            <SidebarContent className="flex-1">
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <div className="p-4 border-t border-gray-700">
                <SidebarMenuButton
                    onClick={() => (window.location.href = "/workflows")}
                    className="w-full flex items-center gap-2 text-blue-500 hover:text-blue-400 hover:bg-blue-500/10 mb-2"
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
