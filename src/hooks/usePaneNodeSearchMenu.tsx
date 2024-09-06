import { memo, useCallback, useContext, useMemo, useState } from "react"
import { CategoryMap } from "@/common/CategoryMap"
import { CategoryId, EdgeData, InputId, NodeData, NodeSchema, OutputId, SchemaId } from "@/common/common-types"
import {
  createUniqueId,
  groupBy,
  parseSourceHandle,
  parseTargetHandle,
  stringifySourceHandle,
  stringifyTargetHandle,
} from "@/common/util"
import { GlobalContext, GlobalVolatileContext } from "@/context/GlobalNodeState"
import { Edge, Node, OnConnectStartParams, useReactFlow } from "reactflow"

interface SchemaItemProps {
  schema: NodeSchema
  isFavorite?: boolean
  accentColor: string
  onClick: (schema: NodeSchema) => void
}

type ConnectionTarget =
  | { type: "source"; input: InputId }
  | { type: "target"; output: OutputId }
  | { type: "none" }

interface MenuProps {
  onSelect: (schema: NodeSchema, target: ConnectionTarget) => void
  targets: ReadonlyMap<NodeSchema, ConnectionTarget>
  schemata: readonly NodeSchema[]
  favorites: ReadonlySet<SchemaId>
  categories: CategoryMap
}

interface UsePaneNodeSearchMenuValue {
  readonly onConnectStart: (event: React.MouseEvent | React.TouchEvent, handle: OnConnectStartParams) => void
  readonly onConnectStop: (event: MouseEvent | TouchEvent) => void
  readonly onPaneContextMenu: (event: React.MouseEvent) => void
}

interface Position {
  readonly x: number
  readonly y: number
}

export const usePaneNodeSearchMenu = (wrapperRef: React.RefObject<HTMLDivElement>): UsePaneNodeSearchMenuValue => {
  const { useConnectingFrom } = useContext(GlobalVolatileContext)

  const [connectingFrom, setConnectingFrom] = useState<OnConnectStartParams | null>(null)
  const [, setGlobalConnectingFrom] = useConnectingFrom

  const [mousePosition, setMousePosition] = useState<Position>({ x: 0, y: 0 })

  const onConnectStart = useCallback(
    (event: React.MouseEvent | React.TouchEvent, handle: OnConnectStartParams) => {
      // eslint-disable-next-line no-param-reassign
      event = event as React.MouseEvent
      setMousePosition({
        x: event.pageX,
        y: event.pageY,
      })
      setConnectingFrom(handle)
      setGlobalConnectingFrom(handle)
    },
    [setConnectingFrom, setGlobalConnectingFrom, setMousePosition]
  )

  const onConnectStop = useCallback(
    (event: MouseEvent | TouchEvent) => {
      // eslint-disable-next-line no-param-reassign
      event = event as MouseEvent
      const target = event.target as Element | SVGTextPathElement

      setMousePosition({
        x: event.pageX,
        y: event.pageY,
      })

      setGlobalConnectingFrom(null)
    },
    [setGlobalConnectingFrom, setMousePosition]
  )

  const onPaneContextMenu = useCallback(
    (event: React.MouseEvent) => {
      setConnectingFrom(null)
      setMousePosition({
        x: event.pageX,
        y: event.pageY,
      })
    },
    [setConnectingFrom, setMousePosition]
  )

  return { onConnectStart, onConnectStop, onPaneContextMenu }
}
