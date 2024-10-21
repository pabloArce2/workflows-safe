import { memo, useState } from "react"
import { interpolateColor } from "@/helpers/colorTools"
import { LucideIcon } from "lucide-react"

import { Icons } from "../Icons"
import { Separator } from "../ui/Separator/Separator"

interface NodeHeaderProps {
    className?: string
    name: string
    icon: LucideIcon
    accentColor: string
    selected: boolean
    nodeColor: string
    nodeGroup: string
    description: string
}

export const NodeHeader = memo(
    ({
        name,
        icon,
        accentColor = "var(--accent)",
        selected,
        className,
        nodeColor,
        nodeGroup,
        description,
    }: NodeHeaderProps) => {
        const IconComponent = icon
        const [descriptionShort, setDescriptionShort] = useState(true)
        const [isTooltipOpen, setIsTooltipOpen] = useState(false)

        const formatedGroup = `{${nodeGroup}}`

        const bgColor = "#fff"
        const gradL = interpolateColor(nodeColor, bgColor, 0.85)
        const gradR = bgColor

        const progColor = interpolateColor(nodeColor, bgColor, 0.3)

        return (
            <div
                style={{
                    background: `linear-gradient(to top right, ${gradL}, ${gradR} )`,
                }}
                className={`${className} flex flex-col pt-2 gap-1 rounded-t-md `}
            >
                <div className="flex items-center py-1 gap-2 justify-center">
                    {IconComponent ? (
                        <IconComponent style={{ color: nodeColor }} />
                    ) : (
                        <Icons.network style={{ color: nodeColor }} />
                    )}
                    <p className="text-md font-bold text-gray-600">{name}</p>
                    {/* <Icons.info className="absolute cursor-pointer hover:text-gray-800" size={15} /> */}
                </div>

                <Separator style={{ background: progColor }} className="w-full" />
            </div>
        )
    }
)
