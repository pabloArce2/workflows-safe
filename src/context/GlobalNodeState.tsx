import { dirname, parse } from "path"
import React, { createContext, memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { VALID, Validity, invalid } from "@/common/Validity"
import {
    EdgeData,
    GetSetState,
    Input,
    InputData,
    InputId,
    InputKind,
    InputValue,
    NodeData,
    Output,
    OutputId,
    SchemaId,
    SetState,
} from "@/common/common-types"
import { getSessionStorageOrDefault } from "@/common/useSessionStorage"
import {
    ParsedSourceHandle,
    ParsedTargetHandle,
    createUniqueId,
    parseSourceHandle,
    parseTargetHandle,
    stringifySourceHandle,
    stringifyTargetHandle,
} from "@/common/util"
import {
    Connection,
    Edge,
    Node,
    OnConnectStartParams,
    Viewport,
    getOutgoers,
    useReactFlow,
    useViewport,
} from "reactflow"

import { NodeProto, createNode as createNodeImpl, withNewData } from "@/lib/reactFlowUtil"
import { useChangeCounter, wrapRefChanges } from "@/hooks/useChangeCounter"
import { useMemoArray, useMemoObject } from "@/hooks/useMemo"

import { BackendContext } from "./BackendContext"
import { useWorkflows } from "./WorkflowsContext"

interface GlobalVolatile {
    nodeChanges: any
    edgeChanges: any
    isValidConnection: (connection: Readonly<Connection>) => Validity
    useConnectingFrom: GetSetState<OnConnectStartParams | null>
}
interface Global {
    reactFlowWrapper: React.RefObject<HTMLDivElement>
    setNodesRef: React.MutableRefObject<SetState<Node<NodeData>[]>>
    setEdgesRef: React.MutableRefObject<SetState<Edge<EdgeData>[]>>
    addNodeChanges: () => void
    addEdgeChanges: () => void
    createConnection: (connection: Connection) => void
    setNodeInputValue: <T extends InputValue>(nodeId: string, inputId: InputId, value: T) => void
    changeNodes: SetState<Node<NodeData>[]>
    changeEdges: SetState<Edge<EdgeData>[]>
    selectNode: (nodeId: string) => void
    createNode: (proto: NodeProto) => void
    createEdge: (from: ParsedSourceHandle, to: ParsedTargetHandle) => void
    updateNodeSchemaId: (id: string, schemaId: SchemaId) => void
    updateNodeInputsById: (id: string, inputs: Input[]) => void
    updateNodeOutputsById: (id: string, outputs: Output[]) => void
    removeNodesById: (ids: readonly string[]) => void
    removeEdgeById: (id: string) => void
    modifyInputs: (nodeId: string, newCount: number) => void
    saveWorkflow: () => Promise<void>
}

enum SaveResult {
    /** The contents were written to disk. */
    Saved,
    /** The file was not saved either because the file did not chain unsaved changes or because the user said not to. */
    NotSaved,
    /** The user canceled the option. */
    Canceled,
}

// TODO: Find default
export const GlobalVolatileContext = createContext<Readonly<GlobalVolatile>>({} as GlobalVolatile)
export const GlobalContext = createContext<Readonly<Global>>({} as Global)

interface GlobalProviderProps {
    reactFlowWrapper: React.RefObject<HTMLDivElement>
    workflowId?: string
}

export const GlobalProvider = memo(
    ({ children, reactFlowWrapper, workflowId }: React.PropsWithChildren<GlobalProviderProps>) => {
        const [nodeChanges, addNodeChanges, nodeChangesRef] = useChangeCounter()
        const [edgeChanges, addEdgeChanges, edgeChangesRef] = useChangeCounter()
        const { schemata } = useContext(BackendContext)
        const { loadWorkflow, saveWorkflow: saveWorkflowToDb } = useWorkflows()

        const {
            setViewport,
            getViewport,
            getNode,
            getNodes,
            getEdges,
            setNodes: rfSetNodes,
            setEdges: rfSetEdges,
            viewportInitialized,
        } = useReactFlow<NodeData, EdgeData>()

        const currentViewport = useViewport()
        const [isLoading, setIsLoading] = useState(true)

        const setNodesRef = useRef<SetState<Node<NodeData>[]>>(rfSetNodes)
        const setEdgesRef = useRef<SetState<Edge<EdgeData>[]>>(rfSetEdges)

        const changeNodes = useMemo(() => wrapRefChanges(setNodesRef, addNodeChanges), [addNodeChanges])
        const changeEdges = useMemo(() => wrapRefChanges(setEdgesRef, addEdgeChanges), [addEdgeChanges])

        // Cargar workflow desde la base de datos
        useEffect(() => {
            if (workflowId) {
                setIsLoading(true)
                loadWorkflow(workflowId)
                    .then((data) => {
                        if (data) {
                            // Preparar los datos para ReactFlow
                            const nodes = data.nodes.map((node) => node.node_data)
                            const edges = data.edges.map((edge) => edge.edge_data)
                            const viewport = data.viewport?.viewport

                            // Cargar los datos en ReactFlow
                            changeNodes(nodes)
                            changeEdges(edges)
                            if (viewport) {
                                setViewport(viewport)
                            }
                        }
                    })
                    .catch((error) => {
                        console.error("Error cargando workflow:", error)
                    })
                    .finally(() => {
                        setIsLoading(false)
                    })
            } else {
                // Sin workflowId, cargar desde sessionStorage (comportamiento antiguo)
                const cachedNodes = getSessionStorageOrDefault<Node<NodeData>[]>("cachedNodes", [])
                const cachedEdges = getSessionStorageOrDefault<Edge<EdgeData>[]>("cachedEdges", [])
                const cachedViewport = getSessionStorageOrDefault<Viewport | null>("cachedViewport", null)

                changeNodes(cachedNodes)
                changeEdges(cachedEdges)
                if (cachedViewport && viewportInitialized) {
                    setViewport(cachedViewport)
                }
                setIsLoading(false)
            }
        }, [workflowId, changeNodes, changeEdges, loadWorkflow, setViewport, viewportInitialized])

        // Guardar workflow en la base de datos
        const saveWorkflow = useCallback(async () => {
            if (!workflowId) return

            try {
                const nodes = getNodes()
                const edges = getEdges()
                const viewport = getViewport()

                await saveWorkflowToDb(workflowId, nodes, edges, viewport)
            } catch (error) {
                console.error("Error guardando workflow:", error)
                throw error
            }
        }, [workflowId, getNodes, getEdges, getViewport, saveWorkflowToDb])

        // Autosave (optional)
        useEffect(() => {
            if (!workflowId) return

            const timerId = setTimeout(() => {
                saveWorkflow().catch(console.error)
            }, 2000) // guardar cada 2 segundos después de cambios

            return () => clearTimeout(timerId)
        }, [nodeChanges, edgeChanges, workflowId, saveWorkflow])

        const [lastSavedChanges, setLastSavedChanges] = useState<
            readonly [nodeChanges: number, edgeChanges: number]
        >([0, 0])

        const modifyNode = useCallback(
            (id: string, mapFn: (oldNode: Node<NodeData>) => Node<NodeData>) => {
                changeNodes((nodes) => {
                    const newNodes: Node<NodeData>[] = []
                    for (const n of nodes) {
                        if (n.id === id) {
                            const newNode = mapFn(n)
                            if (newNode === n) return nodes
                            newNodes.push(newNode)
                        } else {
                            newNodes.push(n)
                        }
                    }
                    return newNodes
                })
            },
            [changeNodes]
        )

        const updateNodeInputsById = useCallback(
            (id: string, inputs: Input[]) => {
                changeNodes((nodes) =>
                    nodes.map((n) => {
                        if (n.id === id) {
                            return { ...n, data: { ...n.data, inputs } }
                        }
                        return n
                    })
                )
            },
            [changeNodes]
        )

        const updateNodeOutputsById = useCallback(
            (id: string, outputs: Output[]) => {
                changeNodes((nodes) =>
                    nodes.map((n) => {
                        if (n.id === id) {
                            return { ...n, data: { ...n.data, outputs } }
                        }
                        return n
                    })
                )
            },
            [changeNodes]
        )

        const updateNodeSchemaId = useCallback(
            (id: string, schemaId: SchemaId) => {
                changeNodes((nodes) =>
                    nodes.map((n) => {
                        if (n.id === id) {
                            return { ...n, data: { ...n.data, schemaId: schemaId } }
                        }
                        return n
                    })
                )
            },
            [changeNodes]
        )

        const removeNodesById = useCallback(
            (ids: readonly string[]) => {
                if (ids.length === 0) return

                const filteredIds = ids.filter((id) => {
                    const node = getNode(id)
                    return !!node
                })
                const toRemove = new Set(filteredIds)
                changeNodes((nodes) => nodes.filter((n) => !toRemove.has(n.id)))
                changeEdges((edges) => edges.filter((e) => !toRemove.has(e.source) && !toRemove.has(e.target)))
            },
            [changeNodes, changeEdges, getNode]
        )

        const removeEdgeById = useCallback(
            (id: string) => {
                changeEdges((edges) => edges.filter((e) => e.id !== id))
            },
            [changeEdges]
        )

        const selectNode = useCallback(
            (id: string) => {
                changeNodes((nodes) =>
                    nodes.map((n) => {
                        if (n.id === id) {
                            return !n.selected ? { ...n, selected: true } : n
                        }
                        return n.selected ? { ...n, selected: false } : n
                    })
                )
            },
            [changeNodes]
        )

        const createNode = useCallback(
            (proto: NodeProto): void => {
                changeNodes((nodes) => {
                    const newNode = createNodeImpl(proto, schemata, true, getNodes().length)
                    return [...nodes.map((n) => (n.selected ? { ...n, selected: false } : n)), newNode]
                })
            },
            [changeNodes, schemata, getNodes]
        )

        const createConnection = useCallback(
            ({ source, sourceHandle, target, targetHandle }: Connection) => {
                if (!source || !target) {
                    return
                }

                // Obtenemos los IDs puros sin los sufijos
                const pureSourceHandle = sourceHandle?.split("-source")[0]
                const pureTargetHandle = targetHandle?.split("-target")[0]

                const id = createUniqueId()
                const newEdge: Edge<EdgeData> = {
                    id,
                    sourceHandle,
                    targetHandle,
                    source,
                    target,
                    type: "main",
                    animated: false,
                    data: {},
                }

                // Primero creamos la conexión
                changeEdges((edges) => [...edges.filter((edge) => edge.targetHandle !== targetHandle), newEdge])

                // Luego actualizamos el valor del input target con el valor del output source
                const sourceNode = getNode(source)
                const targetNode = getNode(target)

                if (!sourceNode || !targetNode) return

                const sourceOutput = sourceNode.data.outputs?.find(
                    (output: Output) => output.id === pureSourceHandle
                )

                if (!sourceOutput) return

                // Actualizamos el nodo target
                modifyNode(target, (node) => ({
                    ...node,
                    data: {
                        ...node.data,
                        inputs: node.data.inputs.map((input: Input) => {
                            if (input.id === pureTargetHandle) {
                                return {
                                    ...input,
                                    value: sourceOutput.value,
                                }
                            }
                            return input
                        }),
                    },
                }))
            },
            [changeEdges, getNode, modifyNode]
        )

        const createEdge = useCallback(
            (from: ParsedSourceHandle, to: ParsedTargetHandle): void => {
                createConnection({
                    source: from.handleId,
                    sourceHandle: stringifySourceHandle(from),
                    target: to.handleId,
                    targetHandle: stringifyTargetHandle(to),
                })
            },
            [createConnection]
        )

        const isValidConnection = useCallback(
            ({ target, source }: Readonly<Connection>): Validity => {
                if (source === target) {
                    return invalid("No se puede conectar un nodo a sí mismo.")
                }

                if (!source || !target) {
                    return invalid("Datos de conexión inválidos.")
                }

                const sourceNode = getNode(source)
                const targetNode = getNode(target)

                if (!sourceNode || !targetNode) {
                    return invalid("Datos de nodo inválidos.")
                }

                const nodes = getNodes()
                const edges = getEdges()

                const checkTargetChildren = (startNode: Node<NodeData>): boolean => {
                    const targetChildren = getOutgoers(startNode, nodes, edges)
                    if (!targetChildren.length) {
                        return false
                    }
                    return targetChildren.some((childNode) => {
                        if (childNode.id === sourceNode.id) {
                            return true
                        }
                        return checkTargetChildren(childNode)
                    })
                }
                const isLoop = checkTargetChildren(targetNode)
                if (isLoop) return invalid("La conexión crearía un bucle infinito.")

                if (sourceNode.type === "newIterator" && targetNode.type === "newIterator") {
                    return invalid("No se pueden conectar dos iteradores.")
                }

                return VALID
            },
            [getNode, getNodes, getEdges]
        )

        const [inputDataChanges, addInputDataChanges] = useChangeCounter()

        const setNodeInputValue = useCallback(
            function <T extends InputValue>(nodeId: string, inputId: InputId, value: T): void {
                modifyNode(nodeId, (old) => {
                    if (old.data.inputData[inputId] === value) {
                        return old
                    }

                    return withNewData(old, "inputData", {
                        ...old.data.inputData,
                        [inputId]: value,
                    })
                })
                addInputDataChanges()
            },
            [modifyNode, addInputDataChanges]
        )

        const modifyInputs = useCallback(
            (nodeId: string, newCount: number) => {
                const node = getNode(nodeId)
                if (!node) return

                const schema = schemata.get(node.data.schemaId)
                if (!schema) return

                // Filtrar los inputs existentes
                const nonEntryInputs = node.data.inputs.filter((input) => {
                    const inputId = input.id || ""
                    return !inputId.includes("entry")
                })

                // Crear nuevos inputs de tipo entry
                const newEntryInputs = Array.from({ length: newCount }, (_, index) => ({
                    id: `${nodeId}-entry-${index + 1}`,
                    type: "any",
                    value: null,
                }))

                // Actualizar el nodo con todos los inputs
                modifyNode(nodeId, (oldNode) => ({
                    ...oldNode,
                    data: {
                        ...oldNode.data,
                        inputs: [...nonEntryInputs, ...newEntryInputs],
                    },
                }))
            },
            [getNode, schemata, modifyNode]
        )

        const globalVolatileValue = useMemoObject<GlobalVolatile>({
            nodeChanges,
            edgeChanges,
            isValidConnection,
            useConnectingFrom: useMemoArray([useState<OnConnectStartParams | null>(null)] as const),
        })

        const globalValue = useMemoObject<Global>({
            reactFlowWrapper,
            setNodesRef,
            setEdgesRef,
            addNodeChanges,
            addEdgeChanges,
            changeNodes,
            changeEdges,
            selectNode,
            createNode,
            createEdge,
            updateNodeSchemaId,
            updateNodeInputsById,
            updateNodeOutputsById,
            setNodeInputValue,
            createConnection,
            removeNodesById,
            removeEdgeById,
            modifyInputs,
            saveWorkflow,
        })

        if (isLoading) {
            return <div>Cargando workflow...</div>
        }

        return (
            <GlobalVolatileContext.Provider value={globalVolatileValue}>
                <GlobalContext.Provider value={globalValue}>{children}</GlobalContext.Provider>
                <div style={{ display: "none" }}>
                    {nodeChanges};{edgeChanges}
                </div>
            </GlobalVolatileContext.Provider>
        )
    }
)
