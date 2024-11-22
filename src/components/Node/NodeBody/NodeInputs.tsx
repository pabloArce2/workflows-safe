import { useEffect, useRef } from "react"
import { NodeSchema, Values } from "@/common/common-types"

interface NodeInputsProps {
    inputsSchema: NodeSchema["inputs"]
    inputs: any[]
    className?: string
    inputValues: NodeSchema["inputValues"]
    onInputPositions?: (positions: number[]) => void
}

export const NodeInputs = ({
    inputsSchema,
    inputs,
    className,
    inputValues,
    onInputPositions,
}: NodeInputsProps) => {
    const entrySchemaInputs = inputsSchema.filter((input) => input.origin === "entry")
    const inputRefs = useRef<(HTMLDivElement | null)[]>([])

    useEffect(() => {
        if (onInputPositions && inputRefs.current.length > 0) {
            const positions = inputRefs.current
                .filter((ref) => ref !== null)
                .map((ref) => {
                    const rect = ref!.getBoundingClientRect()
                    return rect.top + rect.height / 2
                })
            onInputPositions(positions)
        }
    }, [entrySchemaInputs.length, onInputPositions])

    if (!entrySchemaInputs.length) return null

    const gridCols = Math.min(entrySchemaInputs.length, 2)

    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            <div className="flex justify-between items-center gap-1">
                <div className="text-gray-400 text-xs">Inputs</div>
                <code className="text-xs text-gray-600">type: {"{" + inputValues + "}"}</code>
            </div>
            <div className={`flex flex-col justify-between gap-2`}>
                {entrySchemaInputs.map((schemaInput, index) => {
                    const realInput = inputs.find((input) => input.inputId === schemaInput.id)
                    return (
                        <div
                            key={schemaInput.id}
                            ref={(el) => (inputRefs.current[index] = el)}
                            className="px-2 py-1 border rounded-lg bg-gray-100 flex-col"
                        >
                            <div className="flex justify-between">
                                <div className="text-xs text-gray-500 truncate">
                                    {realInput ? `${realInput.value}` : "{empty}"}
                                </div>
                                <div className="text-xs font-medium truncate">{schemaInput.label}</div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
