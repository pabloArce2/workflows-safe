import { memo } from "react"
import { Validity } from "@/common/Validity"

import { UseDisabled } from "@/hooks/useDisabled"
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
        const { canDisable } = useDisable ?? { canDisable: false }

        return (
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
                    <TooltipContent side="bottom" className="bg-black text-white text-xs p-2 max-w-[200px]">
                        {description || "No description available"}
                    </TooltipContent>
                </Tooltip>
            </div>
        )
    }
)
