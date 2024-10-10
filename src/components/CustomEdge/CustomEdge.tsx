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
        const sourceX = _sourceX // - 8 <- To align it with the node
        const targetX = _targetX // + 8
        // Calculate the path for the bezier curve between the source and target nodes
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

        // Determine the stroke color based on the selection state
        const strokeColor = selected ? "#007bff" : "#222" // Blue if selected, otherwise dark gray
        const strokeWidth = selected ? 4 : 2

        useEffect(() => {
            const handleKeyDown = (event: KeyboardEvent) => {
                if (event.key === "Delete" || event.key === "Backspace") {
                    if (selected) {
                        removeEdgeById(id) // Eliminar el nodo seleccionado
                    }
                }
            }

            window.addEventListener("keydown", handleKeyDown)
            return () => {
                window.removeEventListener("keydown", handleKeyDown) // Cleanup
            }
        }, [selected, id, removeEdgeById])

        return (
            <g className="edge-chain-group" style={style}>
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
