import { memo, useState } from "react"
import { Validity } from "@/common/Validity"

import { UseDisabled } from "@/hooks/useDisabled"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/Collapsible/Collapsible"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip/Tooltip"
import { Icons } from "@/components/Icons"

interface NodeFooterProps {
    validity?: Validity
    useDisable?: UseDisabled
    animated?: boolean
    className?: string
    description?: string
    id: string
}

export const NodeFooter = memo(
    ({ id, validity, useDisable, animated, className, description }: NodeFooterProps) => {
        const [isOpen, setIsOpen] = useState(true)
        const { canDisable } = useDisable ?? { canDisable: false }

        return (
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger asChild>
                    <div className="flex justify-center w-full cursor-pointer hover:bg-gray-50 py-1">
                        <Icons.chevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                        />
                    </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <div className="p-2">
                        <div className={`flex justify-between items-center mx-4 ${className}`}>
                            <div></div>
                            <div></div>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Icons.info
                                        className="cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
                                        size={15}
                                    />
                                </TooltipTrigger>
                                <TooltipContent
                                    side="bottom"
                                    className="bg-black text-white text-xs p-2 max-w-[200px]"
                                >
                                    {description || "No description available"}
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </div>
                </CollapsibleContent>
            </Collapsible>
        )
    }
)
