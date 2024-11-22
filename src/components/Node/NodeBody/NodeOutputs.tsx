import { useEffect, useRef } from "react"
import { NodeSchema, Values } from "@/common/common-types"

interface NodeOutputsProps {
    outputs: any[]
    className?: string
    outputsSchema: NodeSchema["outputs"]
    outputValues: NodeSchema["outputValues"]
    onOutputPositions?: (positions: number[]) => void
}

export const NodeOutputs = ({
    outputs,
    outputsSchema,
    className,
    outputValues,
    onOutputPositions,
}: NodeOutputsProps) => {
    if (!outputsSchema?.length) return null
    const outputRefs = useRef<(HTMLDivElement | null)[]>([])

    useEffect(() => {
        if (onOutputPositions && outputRefs.current.length > 0) {
            const positions = outputRefs.current
                .filter((ref) => ref !== null)
                .map((ref) => {
                    const rect = ref!.getBoundingClientRect()
                    return rect.top + rect.height / 2
                })
            onOutputPositions(positions)
        }
    }, [outputsSchema.length, onOutputPositions])

    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            <div className="flex justify-between items-center gap-1">
                <div className="text-gray-400 text-xs">Outputs</div>
                <code className="text-xs text-gray-600">type: {"{" + outputValues + "}"}</code>
            </div>
            <div className={`flex flex-col justify-between gap-2`}>
                {outputsSchema.map((schemaOutput, index) => {
                    const realOutput = outputs?.find((output) => output.outputId === schemaOutput.id)
                    return (
                        <div
                            key={schemaOutput.id}
                            ref={(el) => (outputRefs.current[index] = el)}
                            className="px-2 py-1 border rounded-lg bg-gray-100 flex-col"
                        >
                            <div className="flex gap-2 justify-between">
                                <div className="text-xs font-medium truncate">{schemaOutput.label}</div>
                                <div className="text-xs text-gray-500 truncate">
                                    {realOutput ? `${realOutput.value}` : "{empty}"}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
