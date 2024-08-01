"use client"

import { useRef } from "react"
import { GlobalProvider } from "@/context/GlobalNodeState"
import { EdgeTypes, NodeTypes, ReactFlowProvider } from "reactflow"

import CustomEdge from "@/components/CustomEdge/CustomEdge"

import OpenTabMenuButton from "./components/TabMenu/OpenTabMenuButton"
import TabMenu from "./components/TabMenu/TabMenu"
import WorkflowCanvas from "./components/WorkflowCanvas/WorkflowCanvas"

// Define node and edge types
const nodeTypes: NodeTypes & Record<string, unknown> = {
  regularNode: Node,
  /* newIterator: Node,
  collector: Node, */
}

const edgeTypes: EdgeTypes = {
  main: CustomEdge,
}

// Workflow layout component
const WorkflowLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="h-screen w-full">{children}</div>
}

// This is now a page component
export default function WorkflowPage() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const isOpenNodePanel = false // Control the open state of the node panel

  return (
    <main>
      <ReactFlowProvider>
        <GlobalProvider reactFlowWrapper={reactFlowWrapper}>
          <div className="flex">
            {/* <SideNav defaultOpen /> */}
            <WorkflowLayout>
              {/* <Header /> */}
              <WorkflowCanvas nodeTypes={nodeTypes} edgeTypes={edgeTypes} wrapperRef={reactFlowWrapper} />
              {isOpenNodePanel ? <TabMenu /> : <OpenTabMenuButton />}
            </WorkflowLayout>
          </div>
        </GlobalProvider>
      </ReactFlowProvider>
    </main>
  )
}
