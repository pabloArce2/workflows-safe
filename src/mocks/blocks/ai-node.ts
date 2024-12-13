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
            type: "string", // Cambiado a "string" porque ahora es un dropdown de texto.
            kind: "dropdown", // Indica que es un dropdown.
            origin: "entry",
            label: "Nombre de la cámara",
            optional: false,
            options: [
                { option: "Camara01", value: "Camara01", type: "string" },
                { option: "Camara02", value: "Camara02", type: "string" },
                { option: "Camara03", value: "Camara03", type: "string" },
            ],
            preferredStyle: "dropdown",
            // allowMultiple: true, // Indica que se pueden seleccionar múltiples opciones.
            // hideLabel: false,
            groups: [],
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
