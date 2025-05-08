import React, { createContext, memo, useCallback, useContext, useEffect, useState } from "react"
import { CategoryMap } from "@/common/CategoryMap"
import { SchemaMap } from "@/common/SchemaMap"
import { Category, NodeSchema } from "@/common/common-types"
import { log } from "@/common/log"
import { sortNodes } from "@/common/nodes/sort"
import { nodes_test_data } from "@/mocks/data"
import workflowService from "@/services/workflows"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import isEqual from "react-fast-compare"
import { useTranslation } from "react-i18next"

import { useMemoObject } from "@/hooks/useMemo"

interface BackendContextState {
    schemata: SchemaMap
    categories: CategoryMap
    connectionState: "connecting" | "connected" | "failed"
    refreshNodes: () => void
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

    const nodesQuery = useQuery({
        queryKey: ["nodes"],
        queryFn: async (): Promise<BackendNodesResponse> => {
            try {
                // En un entorno real, aquí se cargarían los nodos desde el backend
                let nodes = nodes_test_data
                return await nodes
            } catch (error) {
                log.error(error)
                throw error
            }
        },
        staleTime: 60000, // 1 minuto
        retry: 3,
        refetchOnWindowFocus: false,
        refetchInterval: periodicRefresh ? 3000 : false,
    })

    let nodeQueryError: unknown
    if (nodesQuery.status === "error") {
        nodeQueryError = nodesQuery.error
    } else if (nodesQuery.failureCount > 1) {
        nodeQueryError = "Error al cargar los nodos del backend."
    }

    useEffect(() => {
        if (nodesQuery.status === "success") {
            const rawResponse = nodesQuery.data
            setNodesInfo((prev) => {
                if (isEqual(prev?.rawResponse, rawResponse)) {
                    return prev
                }

                try {
                    return processBackendResponse(rawResponse)
                } catch (e) {
                    log.error(e)
                    console.error("Error procesando la respuesta de nodos:", e)
                }

                return prev
            })
        }
    }, [nodesQuery.status, nodesQuery.data, backendReady])

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

export const BackendProvider = ({ children }: { children: React.ReactNode }) => {
    const { nodesInfo, connectionState, refreshNodes } = useNodes()

    const value = useMemoObject<BackendContextState>({
        schemata: nodesInfo?.schemata ?? SchemaMap.EMPTY,
        categories: nodesInfo?.categories ?? CategoryMap.EMPTY,
        connectionState,
        refreshNodes,
    })

    return <BackendContext.Provider value={value}>{children}</BackendContext.Provider>
}
