import { Fragment, createElement, useCallback, useContext, useMemo, useState } from "react"
import { NodeSchema } from "@/common/common-types"
import { createUniqueId, groupBy, stringifyTargetHandle } from "@/common/util"
import { BackendContext } from "@/context/BackendContext"
import { GlobalContext } from "@/context/GlobalNodeState"
import { observer } from "mobx-react-lite"
import { HandleType, Node, useReactFlow } from "reactflow"

import { Button } from "@/components/ui/Button/Button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandSeparator,
} from "@/components/ui/Command/Command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover/Popover"
import { Icons } from "@/components/Icons"

import { SubcategoriesCommandItem } from "./NodeColumnCommand"

const AddNextNodeCommand = () => {
  const { createNode, createConnection } = useContext(GlobalContext)
  const { getNodes } = useReactFlow()
  const { schemata, categories } = useContext(BackendContext)

  const [open, setOpen] = useState(false)
  const [selectedNodeName, setSelectedNodeName] = useState("")

  const byCategories = useMemo(() => groupBy(schemata.schemata, "category"), [schemata.schemata])

  const nodeSchema = schemata.schemata.find((node) => node.name === selectedNodeName)

  const handleAddNode = useCallback(() => {
    if (!nodeSchema) {
      console.error("No node schema selected")
      return
    }

    const selectedNode = getNodes().find((n) => n.selected)
    if (!selectedNode) {
      console.error("No node selected to connect from")
      return
    }

    // Simulate the connectingFrom object
    const connectingFrom = {
      nodeId: selectedNode.id,
      handleId: selectedNode.id, // Assuming the handle ID for the output
      handleType: "source" as HandleType,
    }

    const newNodePosition = {
      x: selectedNode.position.x,
      y: selectedNode.position.y + selectedNode?.height + 15,
    }

    const nodeId = createUniqueId()
    createNode({
      id: nodeId,
      position: newNodePosition,
      data: {
        schemaId: nodeSchema.schemaId,
      },
      nodeType: nodeSchema.nodeType,
    })

    createConnection({
      source: connectingFrom.nodeId,
      sourceHandle: connectingFrom.handleId,
      target: nodeId,
      targetHandle: stringifyTargetHandle({ nodeId }),
    })
  }, [createNode, createConnection, getNodes, nodeSchema])

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild className="h-10">
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
            {nodeSchema ? (
              <div className="py-0.5 flex gap-2 items-center px-3 rounded-xl bg-gray-100">
                {nodeSchema.icon &&
                  createElement(nodeSchema.icon, {
                    style: { color: nodeSchema.color },
                    className: "w-4",
                  })}
                <p className="">{nodeSchema.name}</p>
              </div>
            ) : (
              <div className="py-0.5 px-3 rounded-xl bg-gray-100">
                <p className="font-light text-gray-500">New node</p>
              </div>
            )}
            <Icons.chevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command className="w-full">
            <CommandInput placeholder="Search for new node..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              {categories.categories.map((category) => {
                const categoryNodes = byCategories.get(category.id)
                return (
                  <Fragment key={category.id}>
                    <CommandGroup heading={category.name}>
                      {categoryNodes && (
                        <SubcategoriesCommandItem
                          setOpen={setOpen}
                          category={category}
                          categoryNodes={categoryNodes}
                          value={selectedNodeName}
                          setValue={setSelectedNodeName}
                        />
                      )}
                    </CommandGroup>
                    <CommandSeparator />
                  </Fragment>
                )
              })}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <Button type="button" className="w-full" disabled={!selectedNodeName} onClick={handleAddNode}>
        <p>Add node</p>
      </Button>
    </>
  )
}

export default observer(AddNextNodeCommand)
