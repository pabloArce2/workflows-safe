"use client"

import { useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { NodeType } from "@/common/common-types"
import { useAuth } from "@/context/AuthContext"
import { BackendProvider } from "@/context/BackendContext"
import { GlobalProvider } from "@/context/GlobalNodeState"
import { WorkflowProvider } from "@/context/WorkflowsContext"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { EdgeTypes, NodeTypes, ReactFlowProvider } from "reactflow"

import { SidebarProvider } from "@/components/ui/Sidebar/Sidebar"
import { Toaster } from "@/components/ui/Toast/Toaster"
import { TooltipProvider } from "@/components/ui/Tooltip/Tooltip"
import { AppSidebar } from "@/components/AppSidebar/AppSidebar"
import CustomEdge from "@/components/CustomEdge/CustomEdge"
import { Node } from "@/components/Node/Node"

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

export default function WorkflowPage() {
    const reactFlowWrapper = useRef<HTMLDivElement>(null)
    const queryClient = new QueryClient()
    const params = useParams()
    const router = useRouter()
    const { user } = useAuth()
    const workflowId = params.workflowId as string

    useEffect(() => {
        if (!workflowId) {
            router.push("/workflows")
        }
    }, [workflowId, router])

    if (!workflowId) {
        return <div>Cargando...</div>
    }

    return (
        <div className="h-screen w-full overflow-hidden flex flex-col">
            <QueryClientProvider client={queryClient}>
                <TooltipProvider>
                    <BackendProvider>
                        <ReactFlowProvider>
                            <WorkflowProvider>
                                <GlobalProvider reactFlowWrapper={reactFlowWrapper} workflowId={workflowId}>
                                    <SidebarProvider>
                                        <div className="flex h-full">
                                            <AppSidebar />
                                            <main className="flex-1 flex flex-col overflow-hidden">
                                                <TabMenu />
                                                <div ref={reactFlowWrapper} className="flex-1 overflow-hidden">
                                                    <WorkflowCanvas
                                                        nodeTypes={nodeTypes}
                                                        edgeTypes={edgeTypes}
                                                        wrapperRef={reactFlowWrapper}
                                                        //workflowId={workflowId}
                                                    />
                                                </div>
                                            </main>
                                        </div>
                                        <Toaster />
                                    </SidebarProvider>
                                </GlobalProvider>
                            </WorkflowProvider>
                        </ReactFlowProvider>
                    </BackendProvider>
                </TooltipProvider>
            </QueryClientProvider>
        </div>
    )
}
