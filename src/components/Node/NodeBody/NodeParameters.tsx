import { NodeSchema } from "@/common/common-types"

import { Separator } from "@/components/ui/Separator/Separator"

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
            <div className="flex flex-col gap-2">
                {parameterSchemaInputs.map((schemaParam) => {
                    const realParam = inputs.find((input) => input.inputId === schemaParam.id)
                    return (
                        <div key={schemaParam.id} className="px-2 border rounded-lg bg-gray-100 max-w-[200px]">
                            <p className="truncate">
                                <code>
                                    {schemaParam.label} &gt; {realParam ? `{${realParam.value}}` : "{empty}"}
                                </code>
                            </p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
