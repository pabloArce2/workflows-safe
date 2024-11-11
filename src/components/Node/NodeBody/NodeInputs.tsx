import { NodeSchema, Values } from "@/common/common-types"

interface NodeInputsProps {
    inputsSchema: NodeSchema["inputs"]
    inputs: any[]
    className?: string
    inputValues: string
}

export const NodeInputs = ({ inputsSchema, inputs, className, inputValues }: NodeInputsProps) => {
    const entrySchemaInputs = inputsSchema.filter((input) => input.origin === "entry")

    if (!entrySchemaInputs.length) return null

    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            <div className="flex justify-between items-center gap-1">
                <div className="text-gray-400 text-xs">Inputs</div>

                <div className="ml-auto flex items-center justify-center border bg-gray-100 rounded-xl px-2 py-1">
                    <code className="text-xs text-gray-600">{"{" + inputValues + "}"}</code>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
                {entrySchemaInputs.map((schemaInput) => {
                    const realInput = inputs.find((input) => input.inputId === schemaInput.id)
                    return (
                        <div
                            key={schemaInput.id}
                            className="px-2 py-1 border rounded-lg bg-gray-100 flex-col max-w-[150px]"
                        >
                            <div className="flex flex-col">
                                <div className="text-xs font-medium truncate">{schemaInput.label}</div>

                                <div className="text-xs text-gray-500 truncate">
                                    {realInput ? `${realInput.value}` : "{empty}"}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
