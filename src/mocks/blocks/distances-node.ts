import { CategoryId, InputId, NodeGroupId, NodeSchema, OutputId, SchemaId } from "@/common/common-types"

import { Icons } from "@/components/Icons"

export const distanceNode: NodeSchema = {
    schemaId: "distance-node" as SchemaId,
    name: "Filtrar por distancia",
    category: "data-processing" as CategoryId,
    nodeGroup: "detections" as NodeGroupId,
    description: "Filtra las detecciones basadas en la distancia entre clases y un umbral.",
    icon: Icons.ruler,
    color: "#20B2AA",
    nodeType: "regularNode",
    sourceType: "multiple",
    targetType: "multiple",
    inputValues: ["detections"],
    outputValues: ["detections"],

    inputs: [
        {
            id: "input-detections1" as InputId,
            type: "string",
            kind: "generic",
            origin: "entry",
            label: "Detecciones 1",
            optional: false,
        },
        {
            id: "input-operator" as InputId,
            type: "string",
            kind: "operator",
            origin: "parameter",
            label: "Operador de comparación",
            optional: false,
            groups: [],
        },
        {
            id: "input-detections2" as InputId,
            type: "string",
            kind: "generic",
            origin: "entry",
            label: "Detecciones 2",
            optional: false,
        },
        {
            id: "input-distance-threshold" as InputId,
            type: "number",
            kind: "number",
            origin: "parameter",
            label: "Umbral de distancia",
            optional: false,
            groups: [],
        },
    ],
    outputs: [
        {
            id: "output-primary-detections-compliant" as OutputId,
            type: "array",
            label: "Detecciones primarias que cumplen",
            kind: "value",
            description: "Detecciones primarias que cumplen el criterio de distancia.",
        },
        {
            id: "output-primary-detections-noncompliant" as OutputId,
            type: "array",
            label: "Detecciones primarias que no cumplen",
            kind: "value",
            description: "Detecciones primarias que no cumplen el criterio de distancia.",
        },
        {
            id: "output-secondary-detections-compliant" as OutputId,
            type: "array",
            label: "Detecciones secundarias que cumplen",
            kind: "value",
            description: "Detecciones secundarias que cumplen el criterio de distancia.",
        },
        {
            id: "output-secondary-detections-noncompliant" as OutputId,
            type: "array",
            label: "Detecciones secundarias que no cumplen",
            kind: "value",
            description: "Detecciones secundarias que no cumplen el criterio de distancia.",
        },
    ],
}
