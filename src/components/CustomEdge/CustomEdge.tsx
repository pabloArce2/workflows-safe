import React, { memo, useContext, useEffect, useMemo } from "react"
import { GlobalContext } from "@/context/GlobalNodeState"
import { EdgeProps, getBezierPath } from "reactflow"

import "./CustomEdge.scss"
import { EdgeData } from "@/common/common-types"

const CustomEdge = memo(
    ({
        id,
        source,
        target,
        sourceX: _sourceX,
        sourceY,
        targetX: _targetX,
        targetY,
        sourcePosition,
        targetPosition,
        selected,
        sourceHandleId,
        data = {},
        style,
    }: EdgeProps<EdgeData>) => {
        const sourceX = _sourceX
        const targetX = _targetX
        const { removeEdgeById } = useContext(GlobalContext)

        const [edgePath] = useMemo(() => {
            return getBezierPath({
                sourceX,
                sourceY,
                sourcePosition,
                targetX,
                targetY,
                targetPosition,
            })
        }, [sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition])

        // Determine the stroke color and width based on the selection state
        const strokeColor = selected ? "#007bff" : "#222"
        const strokeWidth = selected ? 4 : 2

        useEffect(() => {
            const handleKeyDown = (event: KeyboardEvent) => {
                if ((event.key === "Delete" || event.key === "Backspace") && selected) {
                    removeEdgeById(id)
                }
            }

            window.addEventListener("keydown", handleKeyDown)
            return () => {
                window.removeEventListener("keydown", handleKeyDown)
            }
        }, [selected, id, removeEdgeById])

        return (
            <g className="edge-chain-group" style={style}>
                {/* Invisible path for easier selection */}
                <path
                    d={edgePath}
                    fill="none"
                    stroke="transparent"
                    strokeWidth={strokeWidth + 14} // Increase width for click area
                    className="edge-selectable-layer"
                />

                {/* Visible edge path */}
                <path
                    id={id}
                    className="edge-chain"
                    d={edgePath}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                />
            </g>
        )
    }
)

export default CustomEdge
