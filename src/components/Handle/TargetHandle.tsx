import { useCallback, useContext, useMemo } from "react"
import { VALID, invalid } from "@/common/Validity"
import { NodeType, OutputId } from "@/common/common-types"
import { stringifySourceHandle, stringifyTargetHandle } from "@/common/util"
import { GlobalVolatileContext } from "@/context/GlobalNodeState"
import { Connection } from "reactflow"

import { Handle } from "./Handle"

export interface TargetHandleProps {
    id: string
    nodeType: NodeType
    selected: boolean
}

export const TargetHandle = ({ id, nodeType, selected }: TargetHandleProps) => {
    const { isValidConnection, edgeChanges, useConnectingFrom } = useContext(GlobalVolatileContext)

    const [connectingFrom] = useConnectingFrom

    const sourceHandle = stringifySourceHandle({ nodeId: id })
    const targetHandle = stringifyTargetHandle({ nodeId: id })

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

        // We only want to display the connectingFrom target handle
        if (connectingFrom.handleType === "target") {
            return connectingFrom.handleId === targetHandle
                ? VALID
                : invalid("Cannot create an input-to-input connection")
        }

        // Show same types
        return isValidConnection({
            source: connectingFrom.nodeId,
            sourceHandle: connectingFrom.handleId,
            target: id,
            targetHandle,
        })
    }, [connectingFrom, id, targetHandle, isValidConnection])

    return (
        <Handle
            // connectedColor={isConnected ? handleColors[0] : undefined}
            // handleColors={handleColors}
            selected={selected}
            id={sourceHandle}
            isValidConnection={isValidConnectionForRf}
            nodeType={nodeType}
            type="target"
            validity={validity}
            handleColors={[]}
            connectedColor={undefined}
        />
    )
}
