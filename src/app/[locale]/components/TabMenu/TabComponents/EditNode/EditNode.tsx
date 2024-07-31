import { useContext, useEffect, useMemo, useState } from "react"
import { NodeSchema } from "@/common/common-types"
import { toBackendJson } from "@/common/nodes/toBackendJson"
import { BackendContext } from "@/context/BackendContext"
import { GlobalContext } from "@/context/GlobalNodeState"
import { observer } from "mobx-react-lite"
import { Node, useReactFlow } from "reactflow"

import { Separator } from "@/components/ui/Separator/Separator"
import { Icons } from "@/components/Icons"

import { InputsForm } from "../../../NodeConfigPanel/Inputs/InputsForm"
import { SelectNodeType } from "../../../NodeConfigPanel/SelectNodeType/SelectNodeType"
import AddNextNode from "./AddNextNode/AddNextNode"

const EditNode = () => {
    const [nodeSchema, setNodeSchema] = useState<NodeSchema>()
    const { selectNode } = useContext(GlobalContext)
    const { schemata } = useContext(BackendContext)
    const { getNodes, getEdges } = useReactFlow()

    const nodes = getNodes()

    const node: Node<any> | undefined = useMemo(() => {
        return nodes.find((node) => node.selected === true)
    }, [nodes, selectNode])

    useEffect(() => {
        setNodeSchema(schemata.get(node?.data.schemaId))
    }, [node])

    // console.log(toBackendJson(getNodes(), getEdges(), schemata))

    return (
        <>
            {node ? (
                <div className="h-full overflow-y-auto">
                    <div className="flex flex-col px-10 py-4 gap-2">
                        <h2 className="font-bold">Configurate Node</h2>
                        <p className="text-sm font-light text-gray-500">Select your node configuration</p>
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
                        </div>
                    </div>
                    <Separator className="my-2" />
                    <AddNextNode />
                </div>
            ) : (
                <div className="flex flex-col h-full items-center gap-2 pt-12">
                    <Icons.network className="w-32 h-32 opacity-10" />
                    <p className="text-gray-500">No hay nodo seleccionado</p>
                </div>
            )}
        </>
    )
}

export default observer(EditNode)
