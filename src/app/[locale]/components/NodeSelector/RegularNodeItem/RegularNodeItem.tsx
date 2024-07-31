import { useCallback, useContext, useState } from "react"
import { NodeSchema } from "@/common/common-types"
import { GlobalContext } from "@/context/GlobalNodeState"
import { useReactFlow } from "reactflow"

type Props = {
    node: NodeSchema
}

const RegularNodeItem = ({ node, ...props }: Props) => {
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
            {...props}
            onClick={() => {
                setDidSingleClick(true)
            }}
            onDoubleClick={() => {
                //setDidSingleClick(false)
                createNodeFromSelector()
            }}
            onDragStart={(event) => {
                setDidSingleClick(false)
            }}
        >
            <div className="p-3 border border-border rounded-md">{node.name}</div>
        </div>
    )
}

export default RegularNodeItem
