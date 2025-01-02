import { useCallback, useContext, useEffect, useState } from "react"
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
    inputPositions: string[]
}

const NodeTarget = ({ id, nodeType, selected, schemaId, inputPositions }: NodeTargetProps) => {
    const { schemata } = useContext(BackendContext)
    const [handleCount, setHandleCount] = useState(1)
    const [isTooltipOpen, setIsTooltipOpen] = useState(false)
    const [trampita, setTrampita] = useState(false)

    const schema = schemata.get(schemaId)

    // Wrapper para setHandleCount que también activa la trampita
    const updateHandleCount = useCallback((newCount: number) => {
        setHandleCount(newCount)
        setTrampita((prev) => !prev)
    }, [])

    const positionHandle = (index: number, totalHandles: number) => {
        return `${(100 / (totalHandles + 1)) * (index + 1)}%`
    }

    const getButtonsPosition = useCallback(() => {
        if (inputPositions.length === 0) return "50%"
        return `${inputPositions[0]}`
    }, [inputPositions])

    if (schema.targetType === "none" || schema.nodeType === "onlySource") {
        return null
    }

    if (schema.targetType === "single") {
        const input = schema.inputs[0] // Tomamos el primer input
        return (
            <div className="relative flex flex-col items-center">
                <TargetHandle
                    key={input.id}
                    id={input.id} // Usamos el ID del input
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
                        id={input.id} // Ya estaba correcto
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
                className={`relative flex flex-col gap-2 ${trampita ? "mt-[0.5px]" : ""}`}
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
                        const inputId = `input-${index + 1}` // Generamos un ID consistente
                        return (
                            <TargetHandle
                                key={inputId}
                                id={inputId}
                                nodeType={schema.nodeType}
                                style={{
                                    position: "absolute",
                                    top: inputPositions[index] || positionHandle(index, handleCount),
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

export default NodeTarget
