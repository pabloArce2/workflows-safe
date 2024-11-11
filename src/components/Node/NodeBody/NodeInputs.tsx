import { NodeSchema } from "@/common/common-types"

import { Separator } from "@/components/ui/Separator/Separator"

interface NodeInputsProps {
    inputsSchema: NodeSchema["inputs"]
    inputs: any[]
    className?: string
}

export const NodeInputs = ({ inputsSchema, inputs, className }: NodeInputsProps) => {
    // Filter schema inputs that are of type "entry"
    const entrySchemaInputs = inputsSchema.filter((input) => input.origin === "entry")

    if (!entrySchemaInputs.length) return null

    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            <div className=" text-gray-400 text-xs ">Inputs</div>
            <div className="flex flex-col gap-2">
                {entrySchemaInputs.map((schemaInput) => {
                    const realInput = inputs.find((input) => input.inputId === schemaInput.id)
                    return (
                        <div key={schemaInput.id} className="px-2 border rounded-lg bg-gray-100 max-w-[200px]">
                            <p className="truncate">
                                <code>
                                    {schemaInput.label} &gt; {realInput ? `{${realInput.value}}` : "{empty}"}
                                </code>
                            </p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
