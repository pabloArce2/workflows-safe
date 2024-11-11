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
        // {
        //     id: "input-primary-detections" as InputId,
        //     type: "array",
        //     kind: "detections",
        //     origin: "entry",
        //     label: "Detecciones primarias",
        //     optional: false,
        //     groups: [],
        // },
        {
            id: "input-detections1" as InputId,
            type: "string", // Cambiado a "string" porque ahora es un dropdown de texto.
            kind: "dropdown", // Indica que es un dropdown.
            origin: "entry",
            label: "Detecciones",
            optional: false,
            options: [
                { option: "DeteccionesV01", value: "DeteccionesV01", type: "string" },
                { option: "DeteccionesV02", value: "DeteccionesV02", type: "string" },
                { option: "DeteccionesV03", value: "DeteccionesV03", type: "string" },
            ],
            preferredStyle: "dropdown",
            groups: [],
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
        // {
        //     id: "input-secondary-detections" as InputId,
        //     type: "array",
        //     kind: "detections",
        //     origin: "entry",
        //     label: "Detecciones secundarias",
        //     optional: false,
        //     groups: [],
        // },
        {
            id: "input-detections2" as InputId,
            type: "string", // Cambiado a "string" porque ahora es un dropdown de texto.
            kind: "dropdown", // Indica que es un dropdown.
            origin: "entry",
            label: "Detecciones",
            optional: false,
            options: [
                { option: "DeteccionesV01", value: "DeteccionesV01", type: "string" },
                { option: "DeteccionesV02", value: "DeteccionesV02", type: "string" },
                { option: "DeteccionesV03", value: "DeteccionesV03", type: "string" },
            ],
            preferredStyle: "dropdown",
            addMore: true, // Indica que se pueden agregar más listas de detecciones.
            hideLabel: false,
            groups: [],
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
