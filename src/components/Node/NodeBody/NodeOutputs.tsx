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
            <div className="text-gray-400 text-xs ">Outputs</div>
            <div className="flex flex-col gap-2">
                {outputsSchema.map((schemaOutput) => {
                    const realOutput = outputs?.find((output) => output.outputId === schemaOutput.id)
                    return (
                        <div key={schemaOutput.id} className="px-2 border rounded-lg bg-gray-100 max-w-[200px]">
                            <p className="truncate">
                                <code>
                                    {schemaOutput.label} &gt; {realOutput ? `{${realOutput.value}}` : "{empty}"}
                                </code>
                            </p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
