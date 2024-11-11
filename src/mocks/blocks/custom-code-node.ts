import { CategoryId, InputId, NodeGroupId, NodeSchema, OutputId, SchemaId } from "@/common/common-types"

import { Icons } from "@/components/Icons"

export const CustomCodeNode: NodeSchema = {
    schemaId: "custom-code-node" as SchemaId,
    name: "Custom Code",
    category: "custom-code" as CategoryId,
    nodeGroup: "custom-code-group" as NodeGroupId,
    description: "Permite escribir y ejecutar código personalizado.",
    icon: Icons.code,
    color: "#1E3A8A",
    nodeType: "regularNode",
    inputValues: ["none"],
    outputValues: ["detections"],
    inputs: [
        {
            id: "custom-code-input" as InputId,
            type: "custom-code",
            kind: "custom-code",
            origin: "parameter",
            label: "Código Personalizado",
            optional: false,
            hideLabel: false,
            language: "python",
            multiline: true,
        },
    ],
    outputs: [
        {
            id: "custom-code-output" as OutputId,
            type: "detections",
            label: "Detecciones",
            kind: "detections",
            description: "Detecciones generadas por el código personalizado.",
        },
    ],
}
