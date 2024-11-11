import { useCallback, useContext, useMemo } from "react"
import { VALID, invalid } from "@/common/Validity"
import { NodeType, OutputId } from "@/common/common-types"
import { stringifySourceHandle, stringifyTargetHandle } from "@/common/util"
import { GlobalVolatileContext } from "@/context/GlobalNodeState"
import { Connection } from "reactflow"

import { Handle } from "../Handle"

export interface SourceHandleProps {
    id: string
    nodeType: NodeType
    selected: boolean
    style?: React.CSSProperties
}

export const SourceHandle = ({ id, nodeType, selected, style }: SourceHandleProps) => {
    const { isValidConnection, edgeChanges, useConnectingFrom } = useContext(GlobalVolatileContext)

    const [connectingFrom] = useConnectingFrom

    const sourceHandle = stringifySourceHandle({ nodeId: id })

    // Actualización: La lógica para determinar si una conexión es válida ahora es simplificada.
    const isValidConnectionForRf = useCallback(
        (connection: Readonly<Connection>): boolean => {
            return isValidConnection(connection).isValid
        },
        [isValidConnection]
    )

    const validity = useMemo(() => {
        // no active connection
        if (!connectingFrom) return VALID

        // We only want to display the connectingFrom source handle
        if (connectingFrom.handleType === "source") {
            return connectingFrom.handleId === sourceHandle
                ? VALID
                : invalid("Cannot create an output-to-output connection")
        }

        return isValidConnection({
            source: id,
            sourceHandle,
            target: connectingFrom.nodeId,
            targetHandle: connectingFrom.handleId,
        })
    }, [connectingFrom, id, sourceHandle, isValidConnection])

    return (
        <Handle
            /* connectedColor={isConnected ? handleColors[0] : undefined}
            handleColors={handleColors} */
            id={sourceHandle}
            selected={selected}
            isValidConnection={isValidConnectionForRf}
            nodeType={nodeType}
            type="source"
            validity={validity}
            handleColors={[]}
            connectedColor={undefined}
            style={style}
        />
    )
}
