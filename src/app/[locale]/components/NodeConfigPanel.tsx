import { useContext, useEffect, useMemo, useState } from "react"
import { NodeSchema } from "@/common/common-types"
import { toBackendJson } from "@/common/nodes/toBackendJson"
import { BackendContext } from "@/context/BackendContext"
import { GlobalContext } from "@/context/GlobalNodeState"
import rootStore from "@/stores/RootStore"
import { observer } from "mobx-react-lite"
import { getConnectedEdges, Node, useReactFlow } from "reactflow"

import { createNode } from "@/lib/reactFlowUtil"
import { Button } from "@/components/ui/Button/Button"
import { Separator } from "@/components/ui/Separator/Separator"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/Sheet/Sheet"

import { InputsForm } from "./Inputs/InputsForm"
import { SelectNodeType } from "./SelectNodeType/SelectNodeType"

type Props = {}

const NodeConfigPanel = (props: Props) => {
    const { isOpenNodePanel, setIsOpenNodePanel } = rootStore.workflowStore
    const [nodeSchema, setNodeSchema] = useState<NodeSchema>()
    const { selectNode } = useContext(GlobalContext)
    const { schemata } = useContext(BackendContext)
    const { getNodes, getEdges } = useReactFlow()

    const node: Node<any> | undefined = useMemo(() => {
        let nodes = getNodes()
        return nodes.find((node) => node.selected === true)
    }, [isOpenNodePanel, selectNode, createNode])

    useEffect(() => {
        setNodeSchema(schemata.get(node?.data.schemaId))
    }, [node?.data.schemaId])

    const closeDialog = (e) => {
        e.preventDefault()
        setIsOpenNodePanel(false)
    }

    console.log(toBackendJson(getNodes(), getEdges(), schemata))

    return (
        <>
            {node && (
                <Sheet open={isOpenNodePanel}>
                    <SheetContent onEscapeKeyDown={closeDialog} onPointerDownOutside={closeDialog}>
                        <SheetHeader>
                            <SheetTitle>Configurate Node</SheetTitle>
                            <SheetDescription>Select your node configuration</SheetDescription>
                        </SheetHeader>
                        <div className="justify-start flex flex-col items-center">
                            <Separator className="my-2" />
                            <SelectNodeType node={node} className="w-full" />
                            <Separator className="my-2" />
                            {nodeSchema && nodeSchema.inputs.length > 0 && (
                                <InputsForm
                                    node={node}
                                    inputsSchema={nodeSchema.inputs}
                                    outputsSchema={nodeSchema.outputs}
                                />
                            )}
                            {/* {nodeSchema && nodeSchema.inputs.length > 0 && (
                                <InputsForm node={node} inputsSchema={nodeSchema.inputs} />
                            )} */}
                        </div>
                        <SheetFooter>
                            <SheetClose asChild>{/* <Button type="button">Save changes</Button> */}</SheetClose>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            )}
        </>
    )
}

export default observer(NodeConfigPanel)
