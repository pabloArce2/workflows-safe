import { memo } from "react"
import { NodeSchema, SchemaId } from "@/common/common-types"

import { Separator } from "../../ui/Separator/Separator"
import { NodeInputs } from "./NodeInputs"
import { NodeOutputs } from "./NodeOutputs"
import { NodeParameters } from "./NodeParameters"

interface NodeBodyProps {
    inputs?: any[]
    outputs?: any[]
    animated?: boolean
    className?: string
    schema: NodeSchema
    onInputPositions?: (positions: number[]) => void
    onOutputPositions?: (positions: number[]) => void
}

export const NodeBody = memo(
    ({ inputs, outputs, className, schema, onInputPositions, onOutputPositions }: NodeBodyProps) => {
        return (
            <div className={`flex flex-col gap-3 pt-2 w-fit max-w-[400px] ${className}`}>
                <NodeInputs
                    className="px-4"
                    inputsSchema={schema?.inputs ?? []}
                    inputs={inputs ?? []}
                    inputValues={schema?.inputValues}
                    onInputPositions={onInputPositions}
                />
                {schema?.inputs?.length > 0 && <Separator className="my-1 mx-2" />}
                <NodeParameters className="px-4" inputsSchema={schema?.inputs ?? []} inputs={inputs ?? []} />
                {schema?.outputs?.length > 0 && <Separator className="my-1 mx-2" />}
                <NodeOutputs
                    className="px-4"
                    outputsSchema={schema?.outputs ?? []}
                    outputs={outputs ?? []}
                    outputValues={schema?.outputValues}
                    onOutputPositions={onOutputPositions}
                />
            </div>
        )
    }
)
