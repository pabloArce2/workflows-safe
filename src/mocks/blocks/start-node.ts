import { CategoryId, InputId, NodeGroupId, NodeSchema, OutputId, SchemaId } from "@/common/common-types"

import { Icons } from "@/components/Icons"

export const startNode: NodeSchema = {
    schemaId: "start-cycle-node" as SchemaId,
    name: "Inicio de Ciclo",
    category: "control-flow" as CategoryId,
    nodeGroup: "control" as NodeGroupId,
    description: "Marca el inicio del ciclo de procesos.",
    nodeType: "onlyTarget",
    sourceType: "single",
    targetType: "none",
    icon: Icons.circlePlay,
    inputValues: ["none"],
    outputValues: ["none"],
    inputs: [], // El nodo de inicio generalmente no tiene inputs
    outputs: [],
}
