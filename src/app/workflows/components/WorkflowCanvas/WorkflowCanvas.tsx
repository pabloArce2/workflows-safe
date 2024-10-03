/* eslint-disable @typescript-eslint/no-shadow */
import { DragEvent, memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { EdgeData, NodeData } from "@/common/common-types"
import { log } from "@/common/log"
import {
    EMPTY_ARRAY,
    parseSourceHandle,
    parseTargetHandle,
    stringifySourceHandle,
    stringifyTargetHandle,
} from "@/common/util"
import { GlobalContext } from "@/context/GlobalNodeState"
import ReactFlow, {
    Background,
    BackgroundVariant,
    ControlButton,
    Controls,
    Edge,
    EdgeTypes,
    MiniMap,
    Node,
    NodeTypes,
    OnEdgesChange,
    OnNodesChange,
    Position,
    Viewport,
    XYPosition,
    useEdgesState,
    useKeyPress,
    useNodesState,
    useReactFlow,
} from "reactflow"

import { usePaneNodeSearchMenu } from "@/hooks/usePaneNodeSearchMenu"

interface ReactFlowBoxProps {
    nodeTypes: NodeTypes
    edgeTypes: EdgeTypes
    wrapperRef: React.RefObject<HTMLDivElement>
}

const compareById = (a: Edge | Node, b: Edge | Node) => a.id.localeCompare(b.id)

const WorkflowCanvas = ({ wrapperRef, nodeTypes, edgeTypes }: ReactFlowBoxProps) => {
    const { setNodesRef, setEdgesRef, createConnection } = useContext(GlobalContext)

    const [nodes, setNodes, internalOnNodesChange] = useNodesState<NodeData>([])
    const [edges, setEdges, internalOnEdgesChange] = useEdgesState<EdgeData>([])
    setNodesRef.current = setNodes
    setEdgesRef.current = setEdges

    const onNodesChange: OnNodesChange = useCallback(
        (changes) => {
            // we handle removes ourselves
            internalOnNodesChange(changes.filter((c) => c.type !== "remove"))
        },
        [internalOnNodesChange]
    )
    const onEdgesChange: OnEdgesChange = useCallback(
        (changes) => {
            // we handle removes ourselves
            internalOnEdgesChange(changes.filter((c) => c.type !== "remove"))
        },
        [internalOnEdgesChange]
    )

    const [displayNodes, displayEdges] = useMemo(() => {
        const displayNodes = nodes.map<Node<NodeData>>((n) => ({ ...n })).sort(compareById)
        const displayEdges = edges.map<Edge<EdgeData>>((e) => ({ ...e })).sort(compareById)

        return [displayNodes, displayEdges]
    }, [nodes, edges])

    const { onConnectStart, onConnectStop, onPaneContextMenu } = usePaneNodeSearchMenu(wrapperRef)

    return (
        <main className="w-full h-full bg-muted" ref={wrapperRef}>
            <ReactFlow
                elevateEdgesOnSelect
                elevateNodesOnSelect
                connectionLineContainerStyle={{ zIndex: 1000 }}
                connectionRadius={15}
                maxZoom={8}
                minZoom={0.125}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                nodes={displayNodes}
                edges={displayEdges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={createConnection}
                onConnectStart={onConnectStart}
                onConnectEnd={onConnectStop}
                onPaneContextMenu={onPaneContextMenu}
                style={{
                    zIndex: 0,
                    borderRadius: "0.5rem",
                    backgroundColor: "var(--background)",
                }}
            >
                <Controls className="p-10" />
                <Background gap={16} size={1} variant={BackgroundVariant.Dots} />
            </ReactFlow>
        </main>
    )
}

export default WorkflowCanvas
