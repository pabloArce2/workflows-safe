import { NodeSchema } from "@/common/common-types"

interface NodeOutputsProps {
    outputs: any[]
    className?: string
    outputsSchema: NodeSchema["outputs"]
}

export const NodeOutputs = ({ outputs, outputsSchema, className }: NodeOutputsProps) => {
    if (!outputsSchema?.length) return null

    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            <div className="text-gray-400 text-xs">Outputs</div>
            <div className="grid grid-cols-2 gap-2">
                {outputsSchema.map((schemaOutput) => {
                    const realOutput = outputs?.find((output) => output.outputId === schemaOutput.id)
                    return (
                        <div
                            key={schemaOutput.id}
                            className="px-2 py-1 border rounded-lg bg-gray-100 flex-col max-w-[150px]"
                        >
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
