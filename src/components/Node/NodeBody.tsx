import { memo, useState } from "react"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui//Collapsible/Collapsible"

import { Icons } from "../Icons"
import { Separator } from "../ui/Separator/Separator"

interface NodeBodyProps {
    inputs?: any[]
    outputs?: any[]
    animated?: boolean
}

export const fieldRender = (field: any, type: boolean) => {
    const parsedValue = `{${field.value}}`
    return (
        <div className="px-2 border rounded-lg bg-gray-100 max-w-[200px]">
            <p className="truncate">
                <code className="">
                    {type ? "O" : "I"} &gt; {parsedValue}
                </code>
            </p>
        </div>
    )
}

export const NodeBody = memo(({ inputs, outputs, animated = false }: NodeBodyProps) => {
    const [inputsOpen, setInputsOpen] = useState<boolean>(false)
    const [outputsOpen, setOutputsOpen] = useState<boolean>(false)

    return (
        <div>
            {inputs && inputs.length > 0 && (
                <div>
                    <Separator className="my-2" />
                    <Collapsible
                        className="flex flex-col"
                        open={inputsOpen}
                        onOpenChange={() => setInputsOpen(!inputsOpen)}
                    >
                        <CollapsibleTrigger className="flex place-items-start gap-1 items-center text-gray-400 text-xs w-full">
                            <p>Inputs</p>
                            <Icons.chevronDown
                                className={`duration-300 ${inputsOpen ? "rotate-180" : ""}`}
                                size={15}
                                strokeWidth={1.4}
                            ></Icons.chevronDown>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <div className="flex flex-col gap-2 mt-2">
                                {inputs.map((input, index) => (
                                    <div key={index}>{fieldRender(input, false)}</div>
                                ))}
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                </div>
            )}
            {outputs && outputs.length > 0 && (
                <div>
                    <Separator className="mt-3 mb-2" />
                    <Collapsible
                        className="flex flex-col gap-2"
                        open={outputsOpen}
                        onOpenChange={() => setOutputsOpen(!outputsOpen)}
                    >
                        <CollapsibleTrigger className="flex place-items-start gap-1 items-center text-gray-400 text-xs w-full">
                            <p>Outputs</p>
                            <Icons.chevronDown
                                size={15}
                                strokeWidth={1.4}
                                className={`duration-300 ${outputsOpen ? "rotate-180" : ""}`}
                            ></Icons.chevronDown>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <div className="flex flex-col gap-2 mt-2">
                                {outputs.map((output, index) => (
                                    <div key={index}>{fieldRender(output, true)}</div>
                                ))}
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                </div>
            )}
        </div>
    )
})
