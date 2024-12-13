import { CategoryId, InputId, NodeGroupId, NodeSchema, OutputId, SchemaId } from "@/common/common-types"

import { Icons } from "@/components/Icons"

export const aiNode: NodeSchema = {
    schemaId: "ai-node" as SchemaId,
    name: "Inferencia AI",
    category: "ai-processing" as CategoryId,
    nodeGroup: "ai" as NodeGroupId,
    description: "Se encarga de hacer una inferencia en un modelo de AI.",
    icon: Icons.brainCircuit,
    color: "#6B21A8",
    nodeType: "regularNode",
    sourceType: "variable",
    targetType: "single",
    inputValues: ["camera"],
    outputValues: ["detections"],
    inputs: [
        {
            id: "camera-name" as InputId,
            type: "string",
            kind: "generic",
            origin: "entry",
            label: "Nombre de la cámara",
            optional: false,
        },
    ],
    outputs: [
        {
            id: "camera_detections" as OutputId,
            type: "detections",
            label: "Nombre de las Detecciones",
            kind: "value",
            description: "Variable global que contiene las detecciones de AI.",
        },
    ],
}
