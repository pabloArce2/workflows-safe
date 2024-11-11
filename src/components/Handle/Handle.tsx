import * as React from "react"
import { Validity } from "@/common/Validity"
import { NodeType } from "@/common/common-types"
import { Connection, Position, Handle as RFHandle } from "reactflow"

import "./Handle.css"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip/Tooltip"

export type HandleType = "target" | "source"

interface HandleElementProps {
    type: HandleType
    isValidConnection: (connection: Readonly<Connection>) => boolean
    validity: Validity
    id: string
    nodeType: NodeType
    className?: string
    style?: React.CSSProperties
}

const HandleElement = React.memo(
    ({
        children,
        isValidConnection,
        validity,
        type,
        id,
        nodeType,
        className,
        style,
        ...props
    }: React.PropsWithChildren<HandleElementProps>) => {
        const isIterator = nodeType === "newIterator"
        const isCollector = nodeType === "collector"

        const squaredHandle = (isIterator && type === "source") || (isCollector && type === "target")

        const [isTooltipOpen, setIsTooltipOpen] = React.useState(false)

        return (
            <Tooltip open={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
                <RFHandle
                    isConnectable
                    id={id}
                    isValidConnection={isValidConnection}
                    position={type === "target" ? Position.Left : Position.Right}
                    type={type}
                    className={className}
                    {...props}
                    style={{
                        borderRadius: squaredHandle ? "25%" : "100%",
                        ...style,
                    }}
                    // Manejadores de eventos para controlar la visibilidad del Tooltip
                    onMouseEnter={() => setIsTooltipOpen(true)}
                    onMouseLeave={() => setIsTooltipOpen(false)}
                >
                    {children}
                </RFHandle>
                {!validity.isValid && (
                    <TooltipContent side="top" className="bg-black text-white">
                        {`Unable to connect: ${validity.reason}`}
                    </TooltipContent>
                )}
            </Tooltip>
        )
    }
)

export interface HandleProps {
    id: string
    type: HandleType
    validity: Validity
    isValidConnection: (connection: Readonly<Connection>) => boolean
    handleColors: readonly string[]
    connectedColor: string | undefined
    selected: boolean
    nodeType: NodeType
    className?: string
    style?: React.CSSProperties
}

const getBackground = (colors: readonly string[]): string => {
    if (colors.length === 1) return colors[0]
    const handleColorString = colors
        .map((color, index) => {
            const percent = index / colors.length
            const nextPercent = (index + 1) / colors.length
            return `${color} ${percent * 100}% ${nextPercent * 100}%`
        })
        .join(", ")
    return `conic-gradient(from 90deg, ${handleColorString})`
}

export const Handle = ({
    id,
    type,
    validity,
    isValidConnection,
    handleColors,
    connectedColor,
    nodeType,
    selected,
    className,
    style,
}: HandleProps) => {
    const isConnected = !!connectedColor

    return (
        <HandleElement
            className={`
                handle
                ${isConnected ? "handle-connected" : "handle-disconnected"}
                ${validity.isValid ? "handle-valid" : "handle-invalid"}
                ${selected && "handle-selected"}
                ${type}-handle
                ${className}
            `}
            id={id}
            type={type}
            validity={validity}
            isValidConnection={isValidConnection}
            nodeType={nodeType}
            style={style}
        />
    )
}
