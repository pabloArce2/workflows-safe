import React, { memo, useContext, useEffect, useMemo } from "react"
import { GlobalContext } from "@/context/GlobalNodeState"
import { EdgeProps, getBezierPath } from "reactflow"

import "./CustomEdge.css"

// Extend EdgeProps to include any custom props you might add in the future
interface CustomEdgeProps extends EdgeProps {
    isSelected?: boolean // Prop for determining if the edge is selected
}

const CustomEdge: React.FC<CustomEdgeProps> = memo(
    ({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, isSelected }) => {
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
        const strokeColor = isSelected ? "#007bff" : "#222" // Blue if selected, otherwise dark gray

        useEffect(() => {
            const handleKeyDown = (event: KeyboardEvent) => {
                if (event.key === "Delete" || event.key === "Backspace") {
                    if (isSelected) {
                        removeEdgeById(id) // Eliminar el nodo seleccionado
                    }
                }
            }

            window.addEventListener("keydown", handleKeyDown)
            return () => {
                window.removeEventListener("keydown", handleKeyDown) // Cleanup
            }
        }, [isSelected, id, removeEdgeById])

        return (
            <g className="reactflow__edge reactflow__edge-path " style={style}>
                <path id={id} className="reactflow__edge-path" d={edgePath} fill="none" stroke={strokeColor} />
                {/* Future: Display edge content or EdgeText here */}
            </g>
        )
    }
)

export default CustomEdge
