"use client"

import { useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { NodeType } from "@/common/common-types"
import { useAuth } from "@/context/AuthContext"
import { BackendProvider } from "@/context/BackendContext"
import { GlobalProvider } from "@/context/GlobalNodeState"
import { WorkflowProvider, useWorkflows } from "@/context/WorkflowsContext"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { EdgeTypes, NodeTypes, ReactFlowProvider } from "reactflow"

import { SidebarProvider } from "@/components/ui/Sidebar/Sidebar"
import { Toaster } from "@/components/ui/Toast/Toaster"
import { TooltipProvider } from "@/components/ui/Tooltip/Tooltip"
import { AppSidebar } from "@/components/AppSidebar/AppSidebar"
import CustomEdge from "@/components/CustomEdge/CustomEdge"
import { Node } from "@/components/Node/Node"

import Loader from "../components/Loaders/Loader"
import OpenTabMenuButton from "../components/TabMenu/OpenTabMenuButton"
import TabMenu from "../components/TabMenu/TabMenu"
import WorkflowCanvas from "../components/WorkflowCanvas/WorkflowCanvas"

// Define node and edge types
const nodeTypes: NodeTypes & Record<NodeType, unknown> = {
    regularNode: Node,
    newIterator: Node,
    collector: Node,
    onlyTarget: Node,
    onlySource: Node,
}

const edgeTypes: EdgeTypes = {
    main: CustomEdge,
}

// Workflow layout component
const WorkflowLayout = ({ children }: { children: React.ReactNode }) => {
    return <div className="h-full w-full">{children}</div>
}

const MainContent = ({ workflowId }: { workflowId: string }) => {
    const reactFlowWrapper = useRef<HTMLDivElement>(null)
    const { isOpenNodePanel } = useWorkflows()

    return (
        <GlobalProvider reactFlowWrapper={reactFlowWrapper} workflowId={workflowId}>
            <div className="relative h-full w-full">
                <div className="absolute top-0 left-0 h-full z-50">
                    <AppSidebar workflowId={workflowId} />
                </div>

                <main className="flex-1 flex flex-col overflow-hidden">
                    <div className="h-full w-full">
                        <WorkflowLayout>
                            <div className="relative h-screen w-full">
                                <WorkflowCanvas
                                    nodeTypes={nodeTypes}
                                    edgeTypes={edgeTypes}
                                    wrapperRef={reactFlowWrapper}
                                />
                                {isOpenNodePanel ? <TabMenu /> : <OpenTabMenuButton />}
                            </div>
                        </WorkflowLayout>
                    </div>
                </main>
            </div>
        </GlobalProvider>
    )
}

// This is now a page component
export default function WorkflowPage() {
    const queryClient = new QueryClient()
    const params = useParams()
    const router = useRouter()
    const workflowId = params.workflowId as string

    if (!workflowId) {
        router.push("/workflows")
        return <Loader message="Volviendo a la lista de workflows..." />
    }

    return (
        <div className="h-screen w-full overflow-hidden flex flex-col">
            <QueryClientProvider client={queryClient}>
                <TooltipProvider>
                    <BackendProvider>
                        <ReactFlowProvider>
                            <WorkflowProvider>
                                <SidebarProvider>
                                    <MainContent workflowId={workflowId} />
                                    <Toaster />
                                </SidebarProvider>
                            </WorkflowProvider>
                        </ReactFlowProvider>
                    </BackendProvider>
                </TooltipProvider>
            </QueryClientProvider>
        </div>
    )
}
