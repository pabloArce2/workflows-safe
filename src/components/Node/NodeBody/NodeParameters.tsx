import { NodeSchema } from "@/common/common-types"

interface NodeParametersProps {
    inputsSchema: NodeSchema["inputs"]
    inputs: any[]
    className?: string
}

export const NodeParameters = ({ inputsSchema, inputs, className }: NodeParametersProps) => {
    const parameterSchemaInputs = inputsSchema.filter((input) => input.origin === "parameter")

    if (!parameterSchemaInputs.length) return null

    // Calcula el número de columnas basado en la cantidad de elementos (máximo 3)
    const gridCols = Math.min(parameterSchemaInputs.length, 3)

    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            <div className="text-gray-400 text-xs">Parameters</div>
            <div
                className={`grid ${
                    parameterSchemaInputs.length === 1
                        ? "grid-cols-1"
                        : parameterSchemaInputs.length === 2
                        ? "grid-cols-2"
                        : "grid-cols-3"
                } gap-2`}
            >
                {parameterSchemaInputs.map((schemaParam) => {
                    const realParam = inputs.find((input) => input.inputId === schemaParam.id)
                    return (
                        <div key={schemaParam.id} className="px-2 py-1 border rounded-lg bg-gray-100 flex-col">
                            <div className="flex justify-between gap-1">
                                <div className="text-xs font-medium truncate max-w-[50%]">{schemaParam.label}</div>
                                <div className="text-xs text-gray-500 min-w-fit">
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
