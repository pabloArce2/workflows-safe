import type { Edge, Node } from "reactflow"

import { SchemaMap } from "../SchemaMap"
import {
    BackendJsonEdgeInput,
    BackendJsonInput,
    BackendJsonNode,
    BackendJsonOutput,
    EdgeData,
    InputId,
    NodeData,
    OutputId,
} from "../common-types"
import { ParsedSourceHandle, mapInputValues, mapOutputValues, parseSourceHandle, parseTargetHandle } from "../util"

export const toBackendJson = (
    nodes: readonly Node<NodeData>[],
    edges: readonly Edge<EdgeData>[],
    schemata: SchemaMap
): BackendJsonNode[] => {
    // Validar que los nodos tengan la estructura correcta
    const invalidNodes = nodes.filter((node) => {
        const { data } = node
        const schema = schemata.get(data.schemaId)

        // Si el nodo es de tipo "onlySource" o "onlyTarget", no requiere inputs/outputs respectivamente
        if (schema?.nodeType === "onlySource" && !data.inputs) return false
        if (schema?.nodeType === "onlyTarget" && !data.outputs) return false

        return !data.inputs || !data.outputs
    })

    if (invalidNodes.length > 0) {
        const invalidNodeDetails = invalidNodes.map((node) => ({
            id: node.id,
            // @ts-ignore - node_name existe en el objeto pero TypeScript no lo reconoce
            name: node.node_name,
            missingFields: [!node.data.inputs && "inputs", !node.data.outputs && "outputs"].filter(Boolean),
        }))

        throw new Error(
            `Los siguientes nodos no tienen la estructura correcta:\n` +
                invalidNodeDetails
                    .map((node) => `- Nodo "${node.name}" Falta ${node.missingFields.join(", ")}`)
                    .join("\n")
        )
    }

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
        // const schema = nodeSchemaMap.get(handle.nodeId)
        // if (!schema) {
        //     throw new Error(`Invalid handle: The node id ${handle.nodeId} is not valid`)
        // }

        /* const index = schema.outputs.findIndex((inOut) => inOut.id === handle.outputId)
        if (index === -1) {
            throw new Error(`Invalid handle: There is no output with id ${handle.outputId} in ${schema.name}`)
        } */

        return { type: "edge", id: handle.handleId }
    }

    type Handles<I extends InputId | OutputId> = Record<
        string,
        Record<I, BackendJsonEdgeInput | undefined> | undefined
    >
    const inputHandles: Handles<InputId> = {}
    const outputHandles: Handles<OutputId> = {}

    edges.forEach((element) => {
        const { sourceHandle, targetHandle, source } = element
        if (!sourceHandle || !targetHandle) return

        const sourceH = parseSourceHandle(sourceHandle)
        const targetH = parseTargetHandle(targetHandle)

        ;(inputHandles[targetH.handleId as InputId] ??= {})[targetH.handleId as InputId] = convertHandle(sourceH)
        ;(outputHandles[sourceH.handleId as OutputId] ??= {})[sourceH.handleId as OutputId] =
            convertHandle(targetH)
    })

    const result: BackendJsonNode[] = []

    // Set up each node in the result
    nodes.forEach((element) => {
        const { id, data, type: nodeType } = element
        const { schemaId, inputs, outputs, node_name } = data
        const schema = schemata.get(schemaId)

        if (!nodeType) {
            throw new Error(
                `Expected all nodes to have a node type, but ${schema.name} (id: ${schemaId}) node did not.`
            )
        }

        // Node
        result.push({
            id,
            schemaId,
            nodeName: data.node_name,
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
            outputs: mapOutputValues<BackendJsonOutput>(
                schema,
                (outputId) =>
                    outputHandles[id]?.[outputId] ?? {
                        outputId: outputId,
                        type: "value",
                        value:
                            outputs.find((output: { outputId: OutputId }) => output.outputId === outputId)
                                ?.value ?? null,
                    }
            ),
            nodeType,
            connectedTo: {
                inputs: edges
                    .filter((edge) => edge.target === id)
                    .map((edge) => ({
                        source: edge.source,
                        sourceHandle: parseSourceHandle(edge.sourceHandle || ""),
                        targetHandle: parseTargetHandle(edge.targetHandle || ""),
                    })),
                outputs: edges
                    .filter((edge) => edge.source === id)
                    .map((edge) => ({
                        target: edge.target,
                        sourceHandle: parseSourceHandle(edge.sourceHandle || ""),
                        targetHandle: parseTargetHandle(edge.targetHandle || ""),
                    })),
            },
        })
    })

    return result
}
