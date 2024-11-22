import { memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { VALID, invalid } from "@/common/Validity"
import { NodeData, NodeSchema } from "@/common/common-types"
import { parseTargetHandle, stringifySourceHandle, stringifyTargetHandle } from "@/common/util"
import { BackendContext } from "@/context/BackendContext"
import { GlobalContext, GlobalVolatileContext } from "@/context/GlobalNodeState"
import { useWorkflows } from "@/context/WorkflowsContext"
import { interpolateColor } from "@/helpers/colorTools"
import { observer } from "mobx-react-lite"
import { Connection, useReactFlow } from "reactflow"

import { Handle } from "../Handle/Handle"
import NodeSource from "../Handle/NodeSource/NodeSource"
import NodeTarget from "../Handle/NodeTarget/NodeTarget"
import { TargetHandle } from "../Handle/NodeTarget/TargetHandle"
import { Icons } from "../Icons"
import { Separator } from "../ui/Separator/Separator"
import { NodeBody } from "./NodeBody/NodeBody"
import { NodeFooter } from "./NodeFooter/NodeFooter"
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
    const progColor = interpolateColor(schema?.color || "#000", "#fff", 0.3)

    const { selectNode, removeNodesById } = useContext(GlobalContext)

    const targetRef = useRef<HTMLDivElement>(null)
    const [inputPositions, setInputPositions] = useState<number[]>([])
    const nodeRef = useRef<HTMLDivElement>(null)
    const [outputPositions, setOutputPositions] = useState<number[]>([])

    const onClick = (event: any) => {
        event.preventDefault()
        selectNode(id)
        setIsOpenNodePanel(true)
        setSelectedTabNodePanel("edit")
    }

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement
            const isInputFocused =
                target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable

            if ((event.key === "Delete" || event.key === "Backspace") && selected && !isInputFocused) {
                removeNodesById([id])
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => {
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [selected, id, removeNodesById])

    // Verificar si hay inputs u outputs en el schema
    const hasContent = useMemo(() => {
        return (schema.inputs && schema.inputs.length > 0) || (schema.outputs && schema.outputs.length > 0)
    }, [schema.inputs, schema.outputs])

    const handleInputPositions = useCallback((positions: number[]) => {
        if (nodeRef.current) {
            const nodeRect = nodeRef.current.getBoundingClientRect()
            const relativePositions = positions.map((pos) => pos - nodeRect.top)
            setInputPositions(relativePositions)
        }
    }, [])

    const handleOutputPositions = useCallback((positions: number[]) => {
        if (nodeRef.current) {
            const nodeRect = nodeRef.current.getBoundingClientRect()
            const relativePositions = positions.map((pos) => pos - nodeRect.top)
            setOutputPositions(relativePositions)
        }
    }, [])

    return (
        <div className="flex" ref={nodeRef}>
            <NodeTarget
                id={id}
                nodeType={schema.nodeType}
                selected={selected}
                schemaId={schemaId}
                inputPositions={inputPositions}
            />
            <div
                className={`grid place-content-center bg-node-bg bg-white rounded-md border-[0.5px] transition-all pb-3 
                    ${selected ? "shadow-lg border-blue-400" : "shadow-md border-gray-200"}`}
                ref={targetRef}
                onClick={onClick}
            >
                <NodeHeader
                    nodeColor={schema.color || "#000"}
                    icon={schema.icon || Icons.fileImage}
                    name={schema.name}
                    description={schema.description}
                    nodeGroup={schema.nodeGroup}
                    selected={selected}
                    className=""
                    accentColor={""}
                />
                <div className="min-w-[250px] max-w-[400px]">
                    <NodeBody
                        schema={schema}
                        className=""
                        inputs={data?.inputs || []}
                        outputs={data?.outputs || []}
                        onInputPositions={handleInputPositions}
                        onOutputPositions={handleOutputPositions}
                    />
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
                {hasContent && <Separator style={{ background: progColor }} className="w-full mt-4 mb-2" />}
                <NodeFooter
                    id={id}
                    description={schema.description}
                    // validity={data.validity}
                    // useDisable={data.useDisable}
                    // animated={data.animated}
                />
            </div>
            <NodeSource
                id={id}
                nodeType={schema.nodeType}
                selected={selected}
                schemaId={schemaId}
                outputPositions={outputPositions}
            />
        </div>
    )
})

export default Node
