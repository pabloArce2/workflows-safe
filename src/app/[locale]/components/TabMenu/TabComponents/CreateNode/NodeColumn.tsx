import { useCallback, useContext, useState } from "react"
import { NodeSchema } from "@/common/common-types"
import { GlobalContext } from "@/context/GlobalNodeState"
import { useReactFlow } from "reactflow"

import { Icons } from "@/components/Icons"

interface NodeColumn {
  node: NodeSchema
  className?: string
}

const NodeColumn = ({ node }: NodeColumn) => {
  const IconComponent = node.icon
  const { reactFlowWrapper, createNode } = useContext(GlobalContext)
  const reactFlowInstance = useReactFlow()

  const [didSingleClick, setDidSingleClick] = useState(false)

  const createNodeFromSelector = useCallback(() => {
    if (!reactFlowWrapper.current) return

    const { height: wHeight, width } = reactFlowWrapper.current.getBoundingClientRect()

    const position = reactFlowInstance.screenToFlowPosition({
      x: width / 2,
      y: wHeight / 2,
    })

    createNode({
      nodeType: node.nodeType,
      position,
      data: {
        schemaId: node.schemaId,
      },
    })
  }, [createNode, reactFlowInstance, node.nodeType, reactFlowWrapper])

  return (
    <div
      className="flex items-center px-4 gap-4 w-full h-14 border border-lg rounded-lg shadow-subtle hover:bg-muted bg-muted/30  hover:cursor-pointer"
      onClick={() => {
        setDidSingleClick(true)
      }}
      onDoubleClick={() => {
        //setDidSingleClick(false)
        createNodeFromSelector()
      }}
      onDragStart={() => {
        setDidSingleClick(false)
      }}
    >
      {IconComponent ? (
        <IconComponent size={20} strokeWidth={1.5} style={{ color: node.color }} />
      ) : (
        <Icons.network size={20} strokeWidth={1.5} style={{ color: node.color }} />
      )}
      <p className="text-sm">{node.name}</p>
    </div>
  )
}
export default NodeColumn
