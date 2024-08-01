import { memo, useState } from "react"
import { LucideIcon } from "lucide-react"

import { Icons } from "../Icons"

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
        const formatedGroup = `{${nodeGroup}}`

        // const bgColor = useThemeColor("--bg-700")
        // const gradL = interpolateColor(accentColor, bgColor, 0.9)
        // const gradR = bgColor

        // const progColor = interpolateColor(accentColor, bgColor, 0.5)

        return (
            <div className={`${className} max-w-[200px] flex flex-col gap-1`}>
                <div className="flex items-center py-1">
                    {IconComponent ? (
                        <IconComponent style={{ color: nodeColor }} />
                    ) : (
                        <Icons.network style={{ color: nodeColor }} />
                    )}
                    <div className="ml-auto flex items-center justify-center border bg-gray-100 rounded-xl px-2 py-1">
                        <code className="text-xs text-gray-600">{formatedGroup}</code>
                    </div>
                </div>

                <h3 className="font-bold">{name}</h3>
                <p
                    className={`${descriptionShort ? "truncate" : ""} text-gray-400  cursor-default`}
                    onClick={() => setDescriptionShort(!descriptionShort)}
                >
                    {description}
                </p>
            </div>
        )
    }
)
