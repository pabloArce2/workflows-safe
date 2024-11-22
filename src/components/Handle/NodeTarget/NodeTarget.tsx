import { useContext, useEffect, useState } from "react"
import { NodeType, SchemaId } from "@/common/common-types"
import { BackendContext } from "@/context/BackendContext"
import { GlobalContext } from "@/context/GlobalNodeState"
import { Minus, Plus } from "lucide-react"

import { TargetHandle } from "./TargetHandle"

export interface NodeTargetProps {
    id: string
    nodeType: NodeType
    selected: boolean
    schemaId: SchemaId
    inputPositions: number[]
}

const NodeTarget = ({ id, nodeType, selected, schemaId, inputPositions }: NodeTargetProps) => {
    const { schemata } = useContext(BackendContext)
    const [handleCount, setHandleCount] = useState(1)
    const [isTooltipOpen, setIsTooltipOpen] = useState(false)

    const schema = schemata.get(schemaId)

    const positionHandle = (index: number, totalHandles: number) => {
        return `${(100 / (totalHandles + 1)) * (index + 1)}%`
    }

    // Calcula la posición media de los handles
    const getButtonsPosition = () => {
        if (inputPositions.length === 0) return "50%"
        const firstPos = inputPositions[0] || 0
        const lastPos = inputPositions[inputPositions.length - 1] || 0
        return `${(firstPos + lastPos) / 2}px`
    }

    if (schema.targetType === "none" || schema.nodeType === "onlySource") {
        return null
    }

    if (schema.targetType === "single") {
        return (
            <div className="relative flex flex-col items-center">
                <TargetHandle
                    id={id}
                    nodeType={schema.nodeType}
                    selected={selected}
                    style={{
                        position: "absolute",
                        top: inputPositions[0] || "50%",
                        transform: "translateY(-50%)",
                    }}
                />
            </div>
        )
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
                        style={{
                            position: "absolute",
                            top: inputPositions[index] || positionHandle(index, entryInputs.length),
                            transform: "translateY(-50%)",
                        }}
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
                    <div
                        className="absolute left-[-30px] flex flex-col gap-1 z-50"
                        style={{
                            top: getButtonsPosition(),
                            transform: "translateY(-50%)",
                        }}
                    >
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

                <div className="relative flex flex-col items-center" style={{ height: "100%" }}>
                    {Array.from({ length: handleCount }, (_, index) => (
                        <TargetHandle
                            key={`${id}-entry-${index + 1}`}
                            id={`${id}-entry-${index + 1}`}
                            nodeType={schema.nodeType}
                            style={{
                                position: "absolute",
                                top: inputPositions[index] || positionHandle(index, handleCount),
                                transform: "translateY(-50%)",
                            }}
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
