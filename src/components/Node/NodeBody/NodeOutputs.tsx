import { NodeSchema, Values } from "@/common/common-types"

interface NodeOutputsProps {
    outputs: any[]
    className?: string
    outputsSchema: NodeSchema["outputs"]
    outputValues: string
}

export const NodeOutputs = ({ outputs, outputsSchema, className, outputValues }: NodeOutputsProps) => {
    if (!outputsSchema?.length) return null

    // Calcula el número de columnas basado en la cantidad de elementos (máximo 2)
    const gridCols = Math.min(outputsSchema.length, 2)

    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            <div className="flex justify-between items-center gap-1">
                <div className="text-gray-400 text-xs">Outputs</div>
                <code className="text-xs text-gray-600">type: {"{" + outputValues + "}"}</code>
            </div>
            <div className={`grid grid-cols-${gridCols} gap-2`}>
                {outputsSchema.map((schemaOutput) => {
                    const realOutput = outputs?.find((output) => output.outputId === schemaOutput.id)
                    return (
                        <div key={schemaOutput.id} className="px-2 py-1 border rounded-lg bg-gray-100 flex-col">
                            <div className="flex flex-col">
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
