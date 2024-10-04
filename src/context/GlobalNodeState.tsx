import { dirname, parse } from "path"
import React, { createContext, memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { VALID, Validity, invalid } from "@/common/Validity"
import {
    EdgeData,
    GetSetState,
    InputData,
    InputId,
    InputKind,
    InputValue,
    NodeData,
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
    updateNodeInputsById: (id: string, inputs: any) => void
    updateNodeOutputsById: (id: string, outputs: any) => void
    removeNodesById: (ids: readonly string[]) => void
    removeEdgeById: (id: string) => void
    // getInputHash: (nodeId: string) => string
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
}

export const GlobalProvider = memo(
    ({ children, reactFlowWrapper }: React.PropsWithChildren<GlobalProviderProps>) => {
        const [nodeChanges, addNodeChanges, nodeChangesRef] = useChangeCounter()
        const [edgeChanges, addEdgeChanges, edgeChangesRef] = useChangeCounter()
        const { schemata } = useContext(BackendContext)
        const {
            setViewport,
            getViewport,
            getNode,
            getNodes,
            getEdges,
            setNodes: rfSetNodes,
            setEdges: rfSetEdges,
            viewportInitialized,
            project,
        } = useReactFlow<NodeData, EdgeData>()

        const currentViewport = useViewport()
        const currentReactFlowInstance = useReactFlow()

        const setNodesRef = useRef<SetState<Node<NodeData>[]>>(rfSetNodes)
        const setEdgesRef = useRef<SetState<Edge<EdgeData>[]>>(rfSetEdges)

        const changeNodes = useMemo(() => wrapRefChanges(setNodesRef, addNodeChanges), [addNodeChanges])
        const changeEdges = useMemo(() => wrapRefChanges(setEdgesRef, addEdgeChanges), [addEdgeChanges])

        // Cache node state to avoid clearing state when refreshing
        useEffect(() => {
            const timerId = setTimeout(() => {
                sessionStorage.setItem("cachedNodes", JSON.stringify(getNodes()))
                sessionStorage.setItem("cachedEdges", JSON.stringify(getEdges()))
            }, 100)
            return () => clearTimeout(timerId)
        }, [nodeChanges, edgeChanges, getEdges, getNodes])
        useEffect(() => {
            const timerId = setTimeout(() => {
                sessionStorage.setItem("cachedViewport", JSON.stringify(getViewport()))
            }, 100)
            return () => clearTimeout(timerId)
        }, [currentViewport.x, currentViewport.y, currentViewport.zoom, getViewport])
        const [causeVPEffect, setCauseVPEffect] = useState(0)
        // useEffect(() => {
        //     if (viewportInitialized) {
        //         const cachedViewport = getSessionStorageOrDefault<Viewport | null>("cachedViewport", null)
        //         if (cachedViewport) setViewport(cachedViewport)
        //     }
        // }, [viewportInitialized, setViewport, causeVPEffect])
        useEffect(() => {
            const cachedNodes = getSessionStorageOrDefault<Node<NodeData>[]>("cachedNodes", [])
            const cachedEdges = getSessionStorageOrDefault<Edge<EdgeData>[]>("cachedEdges", [])

            changeNodes(cachedNodes)
            changeEdges(cachedEdges)
            setCauseVPEffect((prev) => prev + 1)
        }, [changeNodes, changeEdges, setCauseVPEffect])

        // const [effectivelyDisabledNodes, setEffectivelyDisabledNodes] = useState<ReadonlySet<string>>(EMPTY_SET)
        // useEffect(() => {
        //     const newEffectivelyDisabled = getEffectivelyDisabledNodes(getNodes(), getEdges())
        //         .map((n) => n.id)
        //         .sort()
        //     setEffectivelyDisabledNodes((prev) => {
        //         const newKey = newEffectivelyDisabled.join(";")
        //         const oldKey = [...prev].join(";")
        //         if (oldKey === newKey) {
        //             return prev
        //         }
        //         return new Set(newEffectivelyDisabled)
        //     })
        // }, [edgeChanges, nodeChanges, getNodes, getEdges])

        /* const [savePath, setSavePathInternal] = useSessionStorage<string | null>("save-path", null)
        const [openRecent, pushOpenPath, removeRecentPath] = useOpenRecent()
        const setSavePath = useCallback(
            (path: string | undefined) => {
                setSavePathInternal(path ?? null)
                if (path) pushOpenPath(path)
            },
            [setSavePathInternal, pushOpenPath]
        ) */

        const [lastSavedChanges, setLastSavedChanges] = useState<
            readonly [nodeChanges: number, edgeChanges: number]
        >([0, 0])
        /**
         * Whether the current chain as *relevant* unsaved changes.
         *
         * Some changes to the chain might not be worth saving (e.g. animation status).
         */
        // eslint-disable-next-line react/hook-use-state
        /* const [hasRelevantUnsavedChanges, setHasRelevantUnsavedChangesImpl] = useState(false)
        const hasRelevantUnsavedChangesRef = useRef(hasRelevantUnsavedChanges)
        const setHasRelevantUnsavedChanges = useCallback((value: boolean) => {
            setHasRelevantUnsavedChangesImpl(value)
            hasRelevantUnsavedChangesRef.current = value
        }, [])
        useEffect(() => {
            const hasUnsavedChanges = lastSavedChanges[0] !== nodeChanges || lastSavedChanges[1] !== edgeChanges
            const value = hasUnsavedChanges && (getNodes().length > 0 || !!savePath)
            setHasRelevantUnsavedChanges(value)
            ipcRenderer.send("update-has-unsaved-changes", value)
        }, [lastSavedChanges, savePath, nodeChanges, edgeChanges, getNodes, setHasRelevantUnsavedChanges])

        useEffect(() => {
            const id = setTimeout(() => {
                const dot = hasRelevantUnsavedChanges ? " •" : ""
                document.title = `chaiNNer - ${savePath || "Untitled"}${dot}`
            }, 200)
            return () => clearTimeout(id)
        }, [savePath, hasRelevantUnsavedChanges])
 */
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
        /*
        const dumpState = useCallback((): SaveData => {
            return {
                nodes: getNodes(),
                edges: getEdges(),
                viewport: getViewport(),
            }
        }, [getNodes, getEdges, getViewport])
 */
        /* const performSave = useCallback(
            async (saveAs: boolean): Promise<SaveResult> => {
                try {
                    const saveData = dumpState()
                    if (!saveAs && savePath) {
                        await ipcRenderer.invoke("file-save-json", saveData, savePath)
                    } else {
                        const result = await ipcRenderer.invoke(
                            "file-save-as-json",
                            saveData,
                            savePath || (openRecent[0] && dirname(openRecent[0]))
                        )
                        if (result.kind === "Canceled") {
                            return SaveResult.Canceled
                        }
                        setSavePath(result.path)
                    }
                    setLastSavedChanges([nodeChangesRef.current, edgeChangesRef.current])
                    return SaveResult.Saved
                } catch (error) {
                    log.error(error)

                    sendToast({
                        status: "error",
                        duration: 10_000,
                        description: `Failed to save chain`,
                    })

                    return SaveResult.Canceled
                }
            },
            [dumpState, edgeChangesRef, nodeChangesRef, openRecent, savePath, sendToast, setSavePath] */

        const updateNodeInputsById = (id: string, inputs: SchemaId) => {
            changeNodes((nodes) =>
                nodes.map((n) => {
                    if (n.id === id) {
                        // Update the node with new value along with any other properties
                        return { ...n, data: { ...n.data, inputs } }
                    }
                    return n
                })
            )
        }

        const updateNodeOutputsById = (id: string, outputs: SchemaId) => {
            changeNodes((nodes) =>
                nodes.map((n) => {
                    if (n.id === id) {
                        // Update the node with new value along with any other properties
                        return { ...n, data: { ...n.data, outputs } }
                    }
                    return n
                })
            )
        }
        const updateNodeSchemaId = (id: string, schemaId: SchemaId) => {
            changeNodes((nodes) =>
                nodes.map((n) => {
                    if (n.id === id) {
                        // Update the node with new value along with any other properties
                        return { ...n, data: { ...n.data, schemaId: schemaId } }
                    }
                    return n
                })
            )
        }

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
                    const newNode = createNodeImpl(proto, schemata, true)
                    return [...nodes.map((n) => (n.selected ? { ...n, selected: false } : n)), newNode]
                })
            },
            [changeNodes, schemata]
        )

        const createConnection = useCallback(
            ({ source, sourceHandle, target, targetHandle }: Connection) => {
                if (!source || !target) {
                    return
                }
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
                changeEdges((edges) => [...edges.filter((edge) => edge.targetHandle !== targetHandle), newEdge])
            },
            [changeEdges]
        )

        const createEdge = useCallback(
            (from: ParsedSourceHandle, to: ParsedTargetHandle): void => {
                createConnection({
                    source: from.nodeId,
                    sourceHandle: stringifySourceHandle(from),
                    target: to.nodeId,
                    targetHandle: stringifyTargetHandle(to),
                })
            },
            [createConnection]
        )

        const isValidConnection = useCallback(
            ({ target, source }: Readonly<Connection>): Validity => {
                if (source === target) {
                    return invalid("Cannot connect a node to itself.")
                }

                if (!source || !target) {
                    return invalid("Invalid connection data.")
                }
                // const sourceHandleId = parseSourceHandle(sourceHandle).outputId
                // const targetHandleId = parseTargetHandle(targetHandle).inputId

                // const sourceFn = typeState.functions.get(source)
                // const targetFn = typeState.functions.get(target)

                // if (!sourceFn || !targetFn) {
                //     return invalid("Invalid connection data.")
                // }

                const sourceNode = getNode(source)
                const targetNode = getNode(target)
                if (!sourceNode || !targetNode) {
                    return invalid("Invalid node data.")
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
                if (isLoop) return invalid("Connection would create an infinite loop.")

                if (sourceNode.type === "newIterator" && targetNode.type === "newIterator") {
                    return invalid("Cannot connect two iterators.")
                }

                // Connections cannot be made if:
                // - The source has iterator lineage AND the target has iterator lineage
                // Connections CAN be made if:
                // - the source has iterator lineage AND the target does not
                // - the target has iterator lineage AND the source does not
                // - neither the source nor the target have iterator lineage
                // Iterator lineage is defined as a node have some downstream or upstream connection to a newIterator node

                /* const sourceDownstreamIterNodes = gatherDownstreamIteratorNodes(sourceNode, nodes, edges)
                const sourceUpstreamIterNodes = gatherUpstreamIteratorNodes(sourceNode, nodes, edges)

                const targetDownstreamIterNodes = gatherDownstreamIteratorNodes(targetNode, nodes, edges)
                const targetUpstreamIterNodes = gatherUpstreamIteratorNodes(targetNode, nodes, edges)

                const sourceHasIteratorLineage =
                    sourceDownstreamIterNodes.size > 0 ||
                    sourceUpstreamIterNodes.size > 0 ||
                    sourceNode.type === "newIterator"
                const targetHasIteratorLineage =
                    targetDownstreamIterNodes.size > 0 ||
                    targetUpstreamIterNodes.size > 0 ||
                    targetNode.type === "newIterator"

                const sourceIters = new Set([
                    ...sourceDownstreamIterNodes,
                    ...sourceUpstreamIterNodes,
                    ...(sourceNode.type === "newIterator" ? [sourceNode.id] : []),
                ])

                const targetIters = new Set([
                    ...targetDownstreamIterNodes,
                    ...targetUpstreamIterNodes,
                    ...(targetNode.type === "newIterator" ? [targetNode.id] : []),
                ])

                const intersectionSource = new Set([...sourceIters].filter((x) => targetIters.has(x)))
                const intersectionTarget = new Set([...targetIters].filter((x) => sourceIters.has(x)))

                const sourceAndTargetShareSameLineage = intersectionSource.size > 0 && intersectionTarget.size > 0

                if (sourceHasIteratorLineage && targetHasIteratorLineage && !sourceAndTargetShareSameLineage) {
                    return invalid("Cannot connect two nodes with unrelated iterator lineage.")
                } */
                return VALID
            },
            [getNode, getNodes, getEdges, schemata]
        )

        const [inputDataChanges, addInputDataChanges] = useChangeCounter()
        // const inputHashesRef = useInputHashes(schemata, [nodeChanges, edgeChanges, inputDataChanges])
        // const getInputHash = useCallback(
        //     (nodeId: string): string => inputHashesRef.current.get(nodeId) ?? "invalid node",
        //     [inputHashesRef]
        // )

        const setNodeInputValue = useCallback(
            // eslint-disable-next-line prefer-arrow-functions/prefer-arrow-functions, func-names
            function <T extends InputValue>(nodeId: string, inputId: InputId, value: T): void {
                modifyNode(nodeId, (old) => {
                    if (old.data.inputData[inputId] === value) {
                        // there's no need to change anything
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

        /* const connectedInputsMap = useMemo(
            () => {
                return lazy(() => {
                    const map = new Map<string, { in: InputId[]; out: OutputId[] }>()
                    for (const e of getEdges()) {
                        if (e.targetHandle) {
                            let entry = map.get(e.target)
                            if (entry === undefined) {
                                entry = { in: [], out: [] }
                                map.set(e.target, entry)
                            }
                            entry.in.push(parseTargetHandle(e.targetHandle).inputId)
                        }
                        if (e.sourceHandle) {
                            let entry = map.get(e.source)
                            if (entry === undefined) {
                                entry = { in: [], out: [] }
                                map.set(e.source, entry)
                            }
                            entry.out.push(parseSourceHandle(e.sourceHandle).outputId)
                        }
                    }

                    const result = new Map<string, readonly [IdSet<InputId>, IdSet<OutputId>]>()
                    for (const [id, { in: ins, out: outs }] of map.entries()) {
                        result.set(id, [IdSet.from(ins), IdSet.from(outs)])
                    }
                    return result
                })
            },
            // eslint-disable-next-line react-hooks/exhaustive-deps
            [edgeChanges, getEdges]
        )
        const getConnected = useCallback(
            (id: string): readonly [IdSet<InputId>, IdSet<OutputId>] =>
                connectedInputsMap().get(id) ?? EMPTY_CONNECTED,
            [connectedInputsMap]
        )

        const duplicateNodes = useCallback(
            (ids: readonly string[], withInputEdges = false) => {
                const nodesToCopy = new Set(ids)

                const duplicationId = createUniqueId()
                const deriveId = (oldId: string) =>
                    nodesToCopy.has(oldId) ? deriveUniqueId(duplicationId + oldId) : oldId

                changeNodes((nodes) => {
                    const newNodes = copyNodes(
                        nodes.filter((n) => nodesToCopy.has(n.id)),
                        deriveId
                    )
                    const derivedIds = ids.map((id) => deriveId(id))
                    newNodes.forEach((n) => {
                        // eslint-disable-next-line no-param-reassign
                        n.selected = derivedIds.includes(n.id)
                    })
                    return [...setSelected(nodes, false), ...newNodes]
                })

                changeEdges((edges) => {
                    const newEdge = copyEdges(
                        edges.filter((e) => {
                            return nodesToCopy.has(e.target) && nodesToCopy.has(e.source)
                        }),
                        deriveId
                    )

                    if (withInputEdges) {
                        const inputEdges = edges.filter((e) => {
                            return nodesToCopy.has(e.target) && !nodesToCopy.has(e.source)
                        })
                        newEdge.push(
                            ...inputEdges.map<Mutable<Edge<EdgeData>>>((e) => {
                                let { target, targetHandle } = e
                                target = deriveId(target)
                                targetHandle = targetHandle?.replace(e.target, target)

                                return {
                                    ...e,
                                    id: createUniqueId(),
                                    target,
                                    targetHandle,
                                    selected: false,
                                }
                            })
                        )
                    }

                    return [...setSelected(edges, false), ...newEdge]
                })
            },
            [changeNodes, changeEdges]
        ) */
        /* 
        const clearNodes = useCallback(
            (ids: readonly string[]) => {
                ids.forEach((id) => {
                    modifyNode(id, (old) => {
                        return withNewData(old, "inputData", schemata.getDefaultInput(old.data.schemaId))
                    })
                    outputDataActions.delete(id)
                    addInputDataChanges()
                    backend.clearNodeCacheIndividual(id).catch(log.error)
                })
            },
            [modifyNode, addInputDataChanges, outputDataActions, backend, schemata]
        )

        const setNodeDisabled = useCallback(
            (id: string, isDisabled: boolean): void => {
                modifyNode(id, (n) => {
                    return withNewData(n, "isDisabled", isDisabled)
                })
            },
            [modifyNode]
        )

        const [viewportExportPadding] = useViewportExportPadding
        const exportViewportScreenshotAs = useCallback(
            (saveAs: (dataUrl: PngDataUrl) => void) => {
                const currentFlowWrapper = reactFlowWrapper.current
                if (!(currentFlowWrapper instanceof HTMLElement)) return

                if (currentReactFlowInstance.getNodes().length === 0) {
                    sendToast({
                        status: "warning",
                        description: "Cannot export viewport because there are no nodes.",
                    })
                }

                takeScreenshot(currentFlowWrapper, currentReactFlowInstance, viewportExportPadding)
                    .then(saveAs)
                    .catch(log.error)
            },
            [reactFlowWrapper, currentReactFlowInstance, viewportExportPadding, sendToast]
        )
        const exportViewportScreenshot = useCallback(() => {
            const currentChainName = savePath ? parse(savePath).name : "Untitled"

            const date = new Date()
            const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`

            const hourString = date.getHours().toString().padStart(2, "0")
            const minuteString = date.getMinutes().toString().padStart(2, "0")
            const timeString = `${hourString}-${minuteString}`

            const fileName = `chaiNNer-${currentChainName}-${dateString}_${timeString}.png`

            exportViewportScreenshotAs((dataUrl) => {
                saveDataUrlAsFile(dataUrl, fileName)
            })
        }, [exportViewportScreenshotAs, savePath])
        const exportViewportScreenshotToClipboard = useCallback(() => {
            exportViewportScreenshotAs((dataUrl) => {
                writeDataUrlToClipboard(dataUrl)
                sendToast({ status: "success", description: "Viewport copied to clipboard." })
            })
        }, [exportViewportScreenshotAs, sendToast])

        const cutFn = useCallback(() => {
            cutAndCopyToClipboard(getNodes(), getEdges(), changeNodes, changeEdges)
        }, [getNodes, getEdges, changeNodes, changeEdges])
        const copyFn = useCallback(() => {
            copyToClipboard(getNodes(), getEdges())
        }, [getNodes, getEdges])
        const pasteFn = useCallback(() => {
            pasteFromClipboard(changeNodes, changeEdges, createNode, project, reactFlowWrapper)
        }, [changeNodes, changeEdges, createNode, project, reactFlowWrapper])
        const selectAllFn = useCallback(() => {
            changeNodes((nodes) => nodes.map((n) => ({ ...n, selected: true })))
            changeEdges((edges) => edges.map((e) => ({ ...e, selected: true })))
        }, [changeNodes, changeEdges])
        const duplicateFn = useCallback(() => {
            const nodesToCopy = getNodes().filter((n) => n.selected)
            duplicateNodes(nodesToCopy.map((n) => n.id))
        }, [getNodes, duplicateNodes])
        const duplicateWithInputEdgesFn = useCallback(() => {
            const nodesToCopy = getNodes().filter((n) => n.selected)
            duplicateNodes(
                nodesToCopy.map((n) => n.id),
                true
            )
        }, [getNodes, duplicateNodes])

        useHotkeys("ctrl+x, cmd+x", cutFn)
        useIpcRendererListener("cut", cutFn)
        useHotkeys("ctrl+c, cmd+c", copyFn)
        useIpcRendererListener("copy", copyFn)
        useHotkeys("ctrl+v, cmd+v", pasteFn)
        useIpcRendererListener("paste", pasteFn)
        useHotkeys("ctrl+d", duplicateFn)
        useIpcRendererListener("duplicate", duplicateFn)
        useHotkeys("ctrl+shift+d", duplicateWithInputEdgesFn)
        useIpcRendererListener("duplicate-with-input-edges", duplicateWithInputEdgesFn)
        useHotkeys("ctrl+p", exportViewportScreenshot)
        useHotkeys("ctrl+shift+p", exportViewportScreenshotToClipboard)
        useIpcRendererListener(
            "export-viewport",
            useCallback(
                (_, kind) => {
                    if (kind === "file") {
                        exportViewportScreenshot()
                    } else {
                        exportViewportScreenshotToClipboard()
                    }
                },
                [exportViewportScreenshot, exportViewportScreenshotToClipboard]
            )
        )
        useHotkeys("ctrl+a, cmd+a", selectAllFn)

        const [zoom, setZoom] = useState(1)

        */

        /* useEffect(() => {
            // remove invalid nodes on schemata changes
            removeNodesById(
                getNodes()
                    .filter((n) => !schemata.has(n.data.schemaId))
                    .map((n) => n.id)
            )
        }, [schemata, getNodes, removeNodesById]) */

        const [connectingFrom, setConnectingFrom] = useState<OnConnectStartParams | null>(null)

        const globalVolatileValue = useMemoObject<GlobalVolatile>({
            nodeChanges,
            edgeChanges,
            isValidConnection,
            /* typeState,
            getConnected,
            effectivelyDisabledNodes,
            
            zoom,
            collidingEdge,
            collidingNode,
            isIndividuallyRunning,
            inputHashes: inputHashesRef.current,
            outputDataMap,*/
            useConnectingFrom: useMemoArray([connectingFrom, setConnectingFrom] as const),
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
            // getInputHash,
            createConnection,
            removeNodesById,
            removeEdgeById,
        })

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
