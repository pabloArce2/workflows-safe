import React, { memo, useMemo } from "react"
import { EdgeProps, getBezierPath } from "reactflow"

// Extend EdgeProps to include any custom props you might add in the future
interface CustomEdgeProps extends EdgeProps {
    // Define any additional props here
}

const CustomEdge: React.FC<CustomEdgeProps> = memo(
    ({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, data }) => {
        // Calculate the path for the bezier curve between the source and target nodes
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

        // Placeholder for future edge content, like displaying node information
        const edgeContent = useMemo(() => {
            // Future implementation: Use sourceNode data to create content displayed on the edge
            return null // Placeholder for now
        }, [])

        return (
            <g className="reactflow__edge reactflow__edge-path" style={style}>
                <path id={id} className="reactflow__edge-path" d={edgePath} fill="none" stroke="#222" />
                {/* Future: Display edgeContent or EdgeText here */}
                {edgeContent}
            </g>
        )
    }
)

export default CustomEdge
