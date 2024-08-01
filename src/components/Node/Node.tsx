import { memo, useCallback, useContext, useMemo, useRef } from "react"
import { VALID, invalid } from "@/common/Validity"
import { NodeData, NodeSchema } from "@/common/common-types"
import { parseTargetHandle, stringifySourceHandle, stringifyTargetHandle } from "@/common/util"
import { BackendContext } from "@/context/BackendContext"
import { GlobalContext, GlobalVolatileContext } from "@/context/GlobalNodeState"
import rootStore from "@/stores/RootStore"
import { observer } from "mobx-react-lite"
import { Connection, useReactFlow } from "reactflow"

import { Handle } from "../Handle/Handle"
import { SourceHandle } from "../Handle/SourceHandle"
import { TargetHandle } from "../Handle/TargetHandle"
import { Icons } from "../Icons"
import { NodeBody } from "./NodeBody"
import { NodeHeader } from "./NodeHeader"

export const Node = observer(({ data, selected }: NodeProps) => (
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  <NodeInner data={data} selected={selected} />
))

export interface NodeProps {
  data: NodeData
  selected: boolean
}

const NodeInner = memo(({ data, selected }: NodeProps) => {
  const { setIsOpenNodePanel, setSelectedTabNodePanel } = rootStore.workflowStore
  const { schemata } = useContext(BackendContext)
  const { id, schemaId } = data
  const schema = schemata.get(schemaId)

  const { selectNode } = useContext(GlobalContext)

  /* const regularBorderColor = "var(--border)"
    const accentColor = getCategoryAccentColor(categories, category)
    const borderColor = useMemo(
        () => (selected ? shadeColor(accentColor, 0) : regularBorderColor),
        [selected, accentColor, regularBorderColor]
    ) */

  const targetRef = useRef<HTMLDivElement>(null)

  //const startingNode = isStartingNode(schema)

  const onClick = (event: any) => {
    event.preventDefault()
    selectNode(id)
    setIsOpenNodePanel(true)
    setSelectedTabNodePanel("edit")
  }

  return (
    <>
      <TargetHandle
        /* connectedColor={isConnected ? sourceTypeColor ?? handleColors[0] : undefined}
                handleColors={handleColors} */
        id={id}
        nodeType={schema.nodeType}
        selected={selected}
      />
      <div
        className={`grid place-content-center bg-node-bg bg-white  min-w-[240px] min-h-[80px] rounded-md border-[0.5px] transition-all py-3
                    ${selected ? "shadow-lg border-blue-400" : "shadow-md border-gray-200"}`}
        // style={{ borderColor: "var(--border)" }}
        ref={targetRef}
        onClick={onClick}
      >
        <div className="min-w-[200px]">
          <NodeHeader
            //accentColor={accentColor}
            nodeColor={schema.color}
            icon={schema.icon}
            name={schema.name}
            description={schema.description}
            nodeGroup={schema.nodeGroup}
            selected={selected}
            className=""
          />
          <NodeBody inputs={data?.inputs} outputs={data?.outputs} />
        </div>
        {selected && (
          <div
            className="absolute rounded-full bg-gray-50 p-1 -right-3 -top-3 shadow-xs border hover:bg-gray-100"
            onClick={() => {
              console.log("borrar nodo ...")
            }}
          >
            <Icons.close className="w-4 h-4 p-0.5 text-gray-400" />
          </div>
        )}
      </div>
      <SourceHandle
        /* connectedColor={isConnected ? sourceTypeColor ?? handleColors[0] : undefined}
            handleColors={handleColors} */
        id={id}
        nodeType={schema.nodeType}
        selected={selected}
      />
    </>
  )
})
