import { memo, useCallback, useContext, useEffect, useMemo, useRef } from "react"
import { VALID, invalid } from "@/common/Validity"
import { NodeData, NodeSchema } from "@/common/common-types"
import { parseTargetHandle, stringifySourceHandle, stringifyTargetHandle } from "@/common/util"
import { BackendContext } from "@/context/BackendContext"
import { GlobalContext, GlobalVolatileContext } from "@/context/GlobalNodeState"
import { useWorkflows } from "@/context/WorkflowsContext"
import { observer } from "mobx-react-lite"
import { Connection, useReactFlow } from "reactflow"

import { Handle } from "../Handle/Handle"
import { SourceHandle } from "../Handle/SourceHandle"
import { TargetHandle } from "../Handle/TargetHandle"
import { Icons } from "../Icons"
import { NodeBody } from "./NodeBody"
import { NodeHeader } from "./NodeHeader"

export const Node = observer(({ data, selected }: NodeProps) => <NodeInner data={data} selected={selected} />)

export interface NodeProps {
    data: NodeData
    selected: boolean
}

const NodeInner = memo(({ data, selected }: NodeProps) => {
    const { setIsOpenNodePanel, setSelectedTabNodePanel } = useWorkflows()
    const { schemata } = useContext(BackendContext)
    const { id, schemaId } = data
    const schema = schemata.get(schemaId)

    const { selectNode, removeNodesById } = useContext(GlobalContext)

    const targetRef = useRef<HTMLDivElement>(null)

    const onClick = (event: any) => {
        event.preventDefault()
        selectNode(id)
        setIsOpenNodePanel(true)
        setSelectedTabNodePanel("edit")
    }

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Delete" || event.key === "Backspace") {
                if (selected) {
                    removeNodesById([id]) // Eliminar el nodo seleccionado
                }
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => {
            window.removeEventListener("keydown", handleKeyDown) // Cleanup
        }
    }, [selected, id, removeNodesById])

    return (
        <>
            <TargetHandle id={id} nodeType={schema.nodeType} selected={selected} />
            <div
                className={`grid place-content-center bg-node-bg bg-white min-w-[240px] min-h-[80px] rounded-md border-[0.5px] transition-all py-3 
                    ${selected ? "shadow-lg border-blue-400" : "shadow-md border-gray-200"}`}
                ref={targetRef}
                onClick={onClick}
            >
                <div className="min-w-[200px]">
                    <NodeHeader
                        nodeColor={schema.color}
                        icon={schema.icon}
                        name={schema.name}
                        description={schema.description}
                        nodeGroup={schema.nodeGroup}
                        selected={selected}
                        className=""
                    />
                    <NodeBody inputs={data?.inputs} outputs={data?.outputs} />
                </div>
                {selected && (
                    <div
                        className="absolute rounded-full bg-gray-50 p-1 -right-3 -top-3 shadow-xs border hover:bg-gray-200 hover:cursor-pointer"
                        onClick={(e: React.MouseEvent) => {
                            e.stopPropagation()
                            removeNodesById([id])
                        }}
                    >
                        <Icons.close className="w-4 h-4 p-0.5 text-gray-600" />
                    </div>
                )}
            </div>
            <SourceHandle id={id} nodeType={schema.nodeType} selected={selected} />
        </>
    )
})

export default Node
