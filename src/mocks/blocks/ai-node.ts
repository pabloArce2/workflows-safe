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
    inputs: [
        {
            id: "camera-name" as InputId,
            type: "string",
            kind: "camera",
            origin: "entry",
            label: "Nombre de la camara",
            optional: false,
            hideLabel: false,
        },
        {
            id: "model-name" as InputId,
            type: "string",
            kind: "Clases",
            origin: "parameter",
            optional: false,
            options: [
                { option: "defectos_goma", value: "defectos_goma", type: "string" },
                { option: "calidad_superficie", value: "calidad_superficie", type: "string" },
                { option: "deteccion_grietas", value: "deteccion_grietas", type: "string" },
                { option: "clasificacion_materiales", value: "clasificacion_materiales", type: "string" },
                { option: "inspeccion_soldaduras", value: "inspeccion_soldaduras", type: "string" },
                { option: "analisis_desgaste", value: "analisis_desgaste", type: "string" },
                { option: "deteccion_corrosion", value: "deteccion_corrosion", type: "string" },
                { option: "control_dimensional", value: "control_dimensional", type: "string" },
                { option: "identificacion_piezas", value: "identificacion_piezas", type: "string" },
                { option: "inspeccion_embalaje", value: "inspeccion_embalaje", type: "string" },
            ],
            preferredStyle: "dropdown",
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
