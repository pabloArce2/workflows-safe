import { useContext, useState } from "react"
import { NodeType, SchemaId } from "@/common/common-types"
import { BackendContext } from "@/context/BackendContext"
import { Minus, Plus } from "lucide-react"

import { TargetHandle } from "./TargetHandle"

export interface NodeTargetProps {
    id: string
    nodeType: NodeType
    selected: boolean
    schemaId: SchemaId
}

const NodeTarget = ({ id, nodeType, selected, schemaId }: NodeTargetProps) => {
    const { schemata } = useContext(BackendContext)
    const [handleCount, setHandleCount] = useState(1)
    const [isTooltipOpen, setIsTooltipOpen] = useState(false)

    const schema = schemata.get(schemaId)

    const positionHandle = (index: number, totalHandles: number) => {
        // Distribuye los handles a lo largo de la altura del contenedor
        return `${(100 / (totalHandles + 1)) * (index + 1)}%`
    }

    if (schema.targetType === "none" || schema.nodeType === "onlySource") {
        return null
    }

    if (schema.targetType === "single") {
        return <TargetHandle id={id} nodeType={schema.nodeType} selected={selected} />
    }

    if (schema.targetType === "multiple") {
        const entryInputs = schema.inputs.filter((input) => input.origin === "entry")

        return (
            <div className="relative flex flex-col gap-2 items-center">
                {entryInputs.map((input, index) => (
                    <TargetHandle
                        key={input.id}
                        id={`${input.id}`}
                        nodeType={schema.nodeType}
                        style={{ top: positionHandle(index, entryInputs.length) }}
                        selected={selected}
                    />
                ))}
            </div>
        )
    }

    if (schema.targetType === "variable") {
        return (
            <div
                className="relative flex flex-col gap-2"
                onMouseEnter={() => setIsTooltipOpen(true)}
                onMouseLeave={() => setIsTooltipOpen(false)}
            >
                {isTooltipOpen && selected && (
                    <div className="absolute left-[-30px] top-1/2 transform -translate-y-1/2 flex flex-col gap-1 z-50">
                        <button
                            className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                            onClick={() => setHandleCount((prev) => Math.min(prev + 1, 8))}
                        >
                            <Plus size={12} />
                        </button>
                        <button
                            className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                            onClick={() => setHandleCount((prev) => Math.max(prev - 1, 1))}
                        >
                            <Minus size={12} />
                        </button>
                    </div>
                )}

                <div className="relative flex flex-col items-center gap-2" style={{ height: "100%" }}>
                    {Array.from({ length: handleCount }, (_, index) => (
                        <TargetHandle
                            key={index}
                            id={`${id}-${index + 1}`}
                            nodeType={schema.nodeType}
                            style={{ top: positionHandle(index, handleCount) }}
                            selected={selected}
                        />
                    ))}
                </div>
            </div>
        )
    }

    return null
}

export default NodeTarget
