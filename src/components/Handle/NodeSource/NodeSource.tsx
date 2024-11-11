import { useContext, useState } from "react"
import { NodeType, SchemaId } from "@/common/common-types"
import { BackendContext } from "@/context/BackendContext"
import { Minus, Plus } from "lucide-react"

import { SourceHandle } from "./SourceHandle"

export interface NodeSourceProps {
    id: string
    nodeType: NodeType
    selected: boolean
    schemaId: SchemaId
}

const NodeSource = ({ id, nodeType, selected, schemaId }: NodeSourceProps) => {
    const { schemata } = useContext(BackendContext)
    const [handleCount, setHandleCount] = useState(1)
    const [isTooltipOpen, setIsTooltipOpen] = useState(false)

    const schema = schemata.get(schemaId)

    const positionHandle = (index: number, totalHandles: number) => {
        // Distribuye los handles a lo largo de la altura del contenedor
        return `${(100 / (totalHandles + 1)) * (index + 1)}%`
    }

    if (schema.sourceType === "none" || schema.nodeType === "onlyTarget") {
        return null
    }

    if (schema.sourceType === "single") {
        return <SourceHandle id={id} nodeType={schema.nodeType} selected={selected} />
    }

    if (schema.sourceType === "multiple") {
        return (
            <div className="relative flex flex-col gap-2 items-center">
                {schema.outputs.map((output, index) => (
                    <SourceHandle
                        key={output.id}
                        id={`${output.id}`}
                        nodeType={schema.nodeType}
                        style={{ top: positionHandle(index, schema.outputs.length) }}
                        selected={selected}
                    />
                ))}
            </div>
        )
    }

    if (schema.sourceType === "variable") {
        return (
            <div
                className="relative flex flex-col gap-2"
                onMouseEnter={() => setIsTooltipOpen(true)}
                onMouseLeave={() => setIsTooltipOpen(false)}
            >
                {isTooltipOpen && selected && (
                    <div className="absolute right-[-30px] top-1/2 transform -translate-y-1/2 flex flex-col gap-1 z-50">
                        <button
                            className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                            onClick={() => setHandleCount((prev) => Math.min(prev + 1, 6))} // Máximo 6 handles
                        >
                            <Plus size={12} />
                        </button>
                        <button
                            className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                            onClick={() => setHandleCount((prev) => Math.max(prev - 1, 1))} // Mínimo 1 handle
                        >
                            <Minus size={12} />
                        </button>
                    </div>
                )}

                <div className="relative flex flex-col items-center gap-2" style={{ height: "100%" }}>
                    {Array.from({ length: handleCount }, (_, index) => (
                        <SourceHandle
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

export default NodeSource
