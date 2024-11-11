import { NodeSchema } from "@/common/common-types"

interface NodeParametersProps {
    inputsSchema: NodeSchema["inputs"]
    inputs: any[]
    className?: string
}

export const NodeParameters = ({ inputsSchema, inputs, className }: NodeParametersProps) => {
    const parameterSchemaInputs = inputsSchema.filter((input) => input.origin === "parameter")

    if (!parameterSchemaInputs.length) return null

    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            <div className="grid grid-cols-3 gap-2">
                {parameterSchemaInputs.map((schemaParam) => {
                    const realParam = inputs.find((input) => input.inputId === schemaParam.id)
                    return (
                        <div
                            key={schemaParam.id}
                            className="px-2 py-1 border rounded-lg bg-gray-100 flex-col max-w-[100px]"
                        >
                            <div className="flex flex-col">
                                <div className="text-xs font-medium truncate">{schemaParam.label}</div>
                                <div className="text-xs text-gray-500 truncate">
                                    {realParam ? `${realParam.value}` : "{empty}"}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
