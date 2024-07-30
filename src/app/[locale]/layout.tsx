import type { Metadata } from "next"
import { Inter } from "next/font/google"

import "@/styles/globals.css"
import { useRef } from "react"
import { NodeType } from "@/common/common-types"
import { GlobalProvider } from "@/context/GlobalNodeState"
import { EdgeTypes, NodeTypes, ReactFlowProvider } from "reactflow"

import CustomEdge from "@/components/CustomEdge/CustomEdge"

import OpenTabMenuButton from "./TabMenu/OpenTabMenuButton"
import TabMenu from "./TabMenu/TabMenu"
import WorkflowCanvas from "./WorkflowCanvas/WorkflowCanvas"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Workflows app",
  description: "An app to create workflows",
}

const nodeTypes: NodeTypes & Record<NodeType, unknown> = {
  regularNode: Node,
  /* newIterator: Node,
  collector: Node, */
}
const edgeTypes: EdgeTypes = {
  main: CustomEdge,
}

const WorkflowLayout = ({ children }: any) => {
  return <div className="h-screen w-full">{children}</div>
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const isOpenNodePanel = false

  return (
    <>
      <main>
        <ReactFlowProvider>
          <GlobalProvider reactFlowWrapper={reactFlowWrapper}>
            <div className="flex">
              {/* <SideNav defaultOpen /> */}
              <WorkflowLayout>
                {/*  <Header /> */}
                {/* <NodeSelector /> */}
                <WorkflowCanvas nodeTypes={nodeTypes} edgeTypes={edgeTypes} wrapperRef={reactFlowWrapper} />
                {isOpenNodePanel ? <TabMenu /> : <OpenTabMenuButton />}
              </WorkflowLayout>
            </div>
            {/* <NodeConfigPanel /> */}
          </GlobalProvider>
        </ReactFlowProvider>
      </main>
    </>
  )
}
