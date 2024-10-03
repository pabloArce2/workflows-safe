import React, { createContext, memo, useCallback, useEffect, useState } from "react"
import { CategoryMap } from "@/common/CategoryMap"
import { SchemaMap } from "@/common/SchemaMap"
import { Category, NodeSchema } from "@/common/common-types"
import { log } from "@/common/log"
import { sortNodes } from "@/common/nodes/sort"
import { nodes_test_data } from "@/mocks/data"
import workflowService from "@/services/workflow.service"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import isEqual from "react-fast-compare"
import { useTranslation } from "react-i18next"

import { useMemoObject } from "@/hooks/useMemo"

interface BackendContextState {
    schemata: SchemaMap
    categories: CategoryMap
    connectionState: "connecting" | "connected" | "failed"
}

export const BackendContext = createContext<Readonly<BackendContextState>>({} as BackendContextState)

export interface BackendNodesResponse {
    nodes: NodeSchema[]
    categories: Category[]
}

interface NodesInfo {
    rawResponse: BackendNodesResponse
    schemata: SchemaMap
    categories: CategoryMap
}

const processBackendResponse = (rawResponse: BackendNodesResponse): NodesInfo => {
    const { categories, nodes } = rawResponse
    const categoryMap = new CategoryMap(categories)

    return {
        rawResponse,
        schemata: new SchemaMap(sortNodes(nodes, categoryMap)),
        categories: categoryMap,
    }
}

const useNodes = () => {
    const { t } = useTranslation()

    const [nodesInfo, setNodesInfo] = useState<NodesInfo>()

    const [backendReady, setBackendReady] = useState(false)

    const queryClient = useQueryClient()
    const refreshNodes = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: ["nodes"] }).catch(log.error)
    }, [queryClient])

    const [periodicRefresh, setPeriodicRefresh] = useState(false)
    // useAsyncEffect(
    //     () => ({
    //         supplier: () => ipcRenderer.invoke("refresh-nodes"),
    //         successEffect: setPeriodicRefresh,
    //     }),
    //     []
    // )

    const nodesQuery = useQuery({
        queryKey: ["nodes"],
        queryFn: async (): Promise<BackendNodesResponse> => {
            try {
                let nodes = nodes_test_data
                return await nodes //workflowService.getNodes()
            } catch (error) {
                log.error(error)
                throw error
            }
        },
        cacheTime: 0,
        retry: 25,
        refetchOnWindowFocus: false,
        refetchInterval: periodicRefresh ? 1000 * 3 : false,
    })

    let nodeQueryError: unknown
    if (nodesQuery.status === "error") {
        nodeQueryError = nodesQuery.error
    } else if (nodesQuery.failureCount > 1) {
        nodeQueryError = "Failed to fetch backend nodes."
    }

    // const lastErrorAlert = useRef<AlertId>()
    // const forgetLastErrorAlert = useCallback(() => {
    //     if (lastErrorAlert.current !== undefined) {
    //         forgetAlert(lastErrorAlert.current)
    //         lastErrorAlert.current = undefined
    //     }
    // }, [forgetAlert])

    useEffect(() => {
        if (nodesQuery.status === "success") {
            //forgetLastErrorAlert() TODO: posible implementacion del sistema de alertas en cola
            const rawResponse = nodesQuery.data
            setNodesInfo((prev) => {
                if (isEqual(prev?.rawResponse, rawResponse)) {
                    return prev
                }

                try {
                    return processBackendResponse(rawResponse)
                } catch (e) {
                    log.error(e)
                    // forgetLastErrorAlert()
                    // lastErrorAlert.current = sendAlert({
                    //     type: AlertType.CRIT_ERROR,
                    //     title: t("error.title.unableToProcessNodes", "Unable to process backend nodes."),
                    //     message: `${t(
                    //         "error.message.criticalBackend",
                    //         "A critical error occurred while processing the node data returned by the backend."
                    //     )}\n\n${String(e)}`,
                    // })
                }

                return prev
            })
        }
    }, [nodesQuery.status, nodesQuery.data, backendReady /* , t */])

    // useEffect(() => {
    //     if (nodeQueryError && !isRestarting) {
    //         const message = nodeQueryError instanceof Error ? nodeQueryError.message : String(nodeQueryError)
    //         forgetLastErrorAlert()
    //         lastErrorAlert.current = sendAlert({
    //             type: AlertType.CRIT_ERROR,
    //             message: `${t(
    //                 "error.message.criticalBackend",
    //                 "A critical error occurred while processing the node data returned by the backend."
    //             )}\n\n${t("error.error", "Error")}: ${message}`,
    //         })
    //     }
    // }, [nodeQueryError, sendAlert, forgetLastErrorAlert, t, isRestarting])

    let connectionState: "connecting" | "connected" | "failed" = "connecting"
    if (nodesQuery.status === "success" && nodesInfo !== undefined) {
        connectionState = "connected"
    } else if (nodesQuery.status === "error") {
        connectionState = "failed"
    }

    return {
        nodesInfo,
        refreshNodes,
        connectionState,
    }
}

export const BackendProvider = ({ children }) => {
    const { nodesInfo, connectionState } = useNodes()

    const value = useMemoObject<BackendContextState>({
        schemata: nodesInfo?.schemata ?? SchemaMap.EMPTY,
        categories: nodesInfo?.categories ?? CategoryMap.EMPTY,
        connectionState,
    })

    return <BackendContext.Provider value={value}>{children}</BackendContext.Provider>
}
