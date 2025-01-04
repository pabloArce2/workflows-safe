import { Dispatch, SetStateAction, useCallback, useContext, useState } from "react"
import { NodeType, SchemaId } from "@/common/common-types"
import { BackendContext } from "@/context/BackendContext"
import { Minus, Plus } from "lucide-react"

import { SourceHandle } from "./SourceHandle"

export interface NodeSourceProps {
    id: string
    nodeType: NodeType
    selected: boolean
    schemaId: SchemaId
    outputPositions: string[]
    setTrampita: Dispatch<SetStateAction<boolean>>
}

const NodeSource = ({ id, nodeType, selected, schemaId, outputPositions, setTrampita }: NodeSourceProps) => {
    const { schemata } = useContext(BackendContext)
    const [handleCount, setHandleCount] = useState(1)
    const [isTooltipOpen, setIsTooltipOpen] = useState(false)

    const schema = schemata.get(schemaId)

    const positionHandle = (index: number, totalHandles: number) => {
        return `${(100 / (totalHandles + 1)) * (index + 1)}%`
    }

    const updateHandleCount = useCallback((newCount: number) => {
        setHandleCount(newCount)
        setTrampita((prev) => !prev)
    }, [])

    // Calcula la posición media de los handles
    const getButtonsPosition = () => {
        if (outputPositions.length === 0) return "50%"
        return `${outputPositions[0]}`
    }

    if (schema.sourceType === "none" || schema.nodeType === "onlyTarget") {
        return null
    }

    if (schema.sourceType === "single") {
        const output = schema.outputs[0]

        return (
            <div className="relative flex flex-col items-center">
                <SourceHandle
                    key={output?.id || id}
                    id={output?.id || id}
                    nodeType={schema.nodeType}
                    selected={selected}
                    style={{
                        position: "absolute",
                        top: outputPositions[0] || "50%",
                        transform: "translateY(-50%)",
                    }}
                />
            </div>
        )
    }

    if (schema.sourceType === "multiple") {
        return (
            <div className="relative flex flex-col gap-2 items-center">
                {schema.outputs.map((output, index) => (
                    <SourceHandle
                        key={output.id}
                        id={output.id}
                        nodeType={schema.nodeType}
                        style={{
                            position: "absolute",
                            top: outputPositions[index] || positionHandle(index, schema.outputs.length),
                            transform: "translateY(-50%)",
                        }}
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
                    <div
                        className="absolute right-[-30px] flex flex-col gap-1 z-50"
                        style={{
                            top: getButtonsPosition(),
                            transform: "translateY(-50%)",
                        }}
                    >
                        <button
                            className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                            onClick={() => updateHandleCount(Math.min(handleCount + 1, 8))}
                        >
                            <Plus size={12} />
                        </button>
                        <button
                            className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                            onClick={() => updateHandleCount(Math.max(handleCount - 1, 1))}
                        >
                            <Minus size={12} />
                        </button>
                    </div>
                )}

                <div className="relative flex flex-col items-center" style={{ height: "100%" }}>
                    {Array.from({ length: handleCount }, (_, index) => {
                        const outputId = schema.outputs[index]?.id || `${id}-output-${index + 1}`
                        return (
                            <SourceHandle
                                key={outputId}
                                id={outputId}
                                nodeType={schema.nodeType}
                                style={{
                                    position: "absolute",
                                    top: outputPositions[index] || positionHandle(index, handleCount),
                                    transform: "translateY(-50%)",
                                }}
                                selected={selected}
                            />
                        )
                    })}
                </div>
            </div>
        )
    }

    return null
}

export default NodeSource
