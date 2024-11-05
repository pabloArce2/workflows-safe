import type { Edge, Node } from "reactflow"

import { SchemaMap } from "../SchemaMap"
import {
    BackendJsonEdgeInput,
    BackendJsonInput,
    BackendJsonNode,
    EdgeData,
    InputId,
    NodeData,
    OutputId,
} from "../common-types"
import { ParsedSourceHandle, mapInputValues, parseSourceHandle, parseTargetHandle } from "../util"

export const toBackendJson = (
    nodes: readonly Node<NodeData>[],
    edges: readonly Edge<EdgeData>[],
    schemata: SchemaMap
): BackendJsonNode[] => {
    const nodeSchemaMap = new Map(nodes.map((n) => [n.id, schemata.get(n.data.schemaId)]))

    const connectionsDetail: Record<string, { inputs: string[]; outputs: string[] }> = {}

    // Preparar estructura con detalles de las conexiones
    nodes.forEach((node) => {
        connectionsDetail[node.id] = { inputs: [], outputs: [] }
    })

    edges.forEach((edge) => {
        const sourceNodeId = edge.source
        const targetNodeId = edge.target
        if (!sourceNodeId || !targetNodeId) return

        // Añadir el nodo destino al arreglo de outputs del nodo origen
        connectionsDetail[sourceNodeId].outputs.push(targetNodeId)
        // Añadir el nodo origen al arreglo de inputs del nodo destino
        connectionsDetail[targetNodeId].inputs.push(sourceNodeId)
    })

    const convertHandle = (handle: ParsedSourceHandle): BackendJsonEdgeInput => {
        const schema = nodeSchemaMap.get(handle.nodeId)
        if (!schema) {
            throw new Error(`Invalid handle: The node id ${handle.nodeId} is not valid`)
        }

        /* const index = schema.outputs.findIndex((inOut) => inOut.id === handle.outputId)
        if (index === -1) {
            throw new Error(`Invalid handle: There is no output with id ${handle.outputId} in ${schema.name}`)
        } */

        return { type: "edge", id: handle.nodeId }
    }

    type Handles<I extends InputId | OutputId> = Record<
        string,
        Record<I, BackendJsonEdgeInput | undefined> | undefined
    >
    const inputHandles: Handles<InputId> = {}
    const outputHandles: Handles<OutputId> = {}

    edges.forEach((element) => {
        const { sourceHandle, targetHandle } = element
        if (!sourceHandle || !targetHandle) return

        const sourceH = parseSourceHandle(sourceHandle)
        const targetH = parseTargetHandle(targetHandle)

        ;(inputHandles[targetH.nodeId] ??= {})[targetH.inputId] = convertHandle(sourceH)
        ;(outputHandles[sourceH.nodeId] ??= {})[sourceH.outputId] = convertHandle(targetH)
    })

    const result: BackendJsonNode[] = []

    // Set up each node in the result
    nodes.forEach((element) => {
        const { id, data, type: nodeType } = element
        const { schemaId, inputs, outputs } = data
        const schema = schemata.get(schemaId)
        // console.log(inputs)

        if (!nodeType) {
            throw new Error(
                `Expected all nodes to have a node type, but ${schema.name} (id: ${schemaId}) node did not.`
            )
        }

        // Node
        result.push({
            id,
            schemaId,
            inputs: mapInputValues<BackendJsonInput>(
                schema,
                (inputId) =>
                    inputHandles[id]?.[inputId] ?? {
                        inputId: inputId,
                        type: "value",
                        value:
                            inputs.find((input: { inputId: InputId }) => input.inputId === inputId)?.value ?? null,
                    }
            ),
            // outputs: mapInputValues<BackendJsonInput>(
            //     schema,
            //     (outputId) =>
            //         outputHandles[id]?.[outputId] ?? {
            //             outputId: outputId,
            //             type: "value",
            //             value: null,
            //         }
            // ),
            nodeType,
            connectedTo: {
                inputs: connectionsDetail[element.id].inputs,
                outputs: connectionsDetail[element.id].outputs,
            },
        })
    })

    return result
}
