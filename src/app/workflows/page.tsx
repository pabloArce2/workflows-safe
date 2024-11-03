"use client"

import { useRef } from "react"
import { NodeType } from "@/common/common-types"
import { BackendProvider } from "@/context/BackendContext"
import { GlobalProvider } from "@/context/GlobalNodeState"
import { WorkflowProvider, useWorkflows } from "@/context/WorkflowsContext"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { EdgeTypes, NodeTypes, ReactFlowProvider } from "reactflow"

import { SidebarProvider } from "@/components/ui/Sidebar/Sidebar"
import { TooltipProvider } from "@/components/ui/Tooltip/Tooltip"
import { AppSidebar } from "@/components/AppSidebar/AppSidebar"
import CustomEdge from "@/components/CustomEdge/CustomEdge"
import { Node } from "@/components/Node/Node"

import OpenTabMenuButton from "./components/TabMenu/OpenTabMenuButton"
import TabMenu from "./components/TabMenu/TabMenu"
import WorkflowCanvas from "./components/WorkflowCanvas/WorkflowCanvas"

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
    return <div className="h-screen w-full">{children}</div>
}

const MainContent = () => {
    const reactFlowWrapper = useRef<HTMLDivElement>(null)
    const { isOpenNodePanel } = useWorkflows()

    return (
        <GlobalProvider reactFlowWrapper={reactFlowWrapper}>
            <AppSidebar />

            <div className="flex flex-grow">
                {/* <SideNav defaultOpen /> */}
                <WorkflowLayout>
                    {/* <Header /> */}
                    <WorkflowCanvas nodeTypes={nodeTypes} edgeTypes={edgeTypes} wrapperRef={reactFlowWrapper} />
                    {isOpenNodePanel ? <TabMenu /> : <OpenTabMenuButton />}
                </WorkflowLayout>
            </div>
        </GlobalProvider>
    )
}

// This is now a page component
export default function WorkflowPage() {
    const queryClient = new QueryClient()

    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <BackendProvider>
                    <ReactFlowProvider>
                        <WorkflowProvider>
                            <SidebarProvider>
                                <MainContent />
                            </SidebarProvider>
                        </WorkflowProvider>
                    </ReactFlowProvider>
                </BackendProvider>
            </TooltipProvider>
        </QueryClientProvider>
    )
}
