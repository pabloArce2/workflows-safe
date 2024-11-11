import { CategoryId, InputId, NodeGroupId, NodeSchema, OutputId, SchemaId } from "@/common/common-types"

import { Icons } from "@/components/Icons"

export const filterNode: NodeSchema = {
    schemaId: "filter-node" as SchemaId,
    name: "Filtrar detecciones",
    category: "data-processing" as CategoryId,
    nodeGroup: "detections" as NodeGroupId,
    description:
        "Filtra detecciones basadas en comparaciones aplicadas a los valores de las detecciones (clase, velocidad, postura, etc.).",
    icon: Icons.filter,
    color: "#7A1223",
    nodeType: "regularNode",
    sourceType: "multiple",
    targetType: "single",
    inputValues: ["detections"],
    outputValues: ["detections"],

    inputs: [
        // {
        //     id: "input-detections" as InputId,
        //     type: "array",
        //     kind: "detections",
        //     origin: "entry",
        //     list: "detections",
        //     label: "Detecciones",
        //     optional: false,
        //     groups: [],
        // },
        {
            id: "input-detections" as InputId,
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
            id: "input-filter-type" as InputId,
            type: "string",
            kind: "dropdown",
            origin: "parameter",
            label: "Tipo de filtro",
            options: [
                { option: "clase", value: "clase" },
                { option: "speed", value: "speed" },
                { option: "postura", value: "postura" },
                { option: "zona", value: "zona" },
                { option: "asociados", value: "asociados" },
                { option: "coord", value: "coord" },
                { option: "bbox", value: "bbox" },
            ],
            optional: false,
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
        {
            id: "input-value" as InputId,
            type: "string",
            kind: "text",
            label: "Valor",
            optional: false,
            origin: "parameter",
            groups: [],
            description: "Valor a comparar según el tipo y el operador seleccionado.",
        },
    ],
    outputs: [
        {
            id: "output-filtered-detections-pass" as OutputId,
            type: "array",
            label: "Detecciones que cumplen",
            kind: "value",
            description: "Lista de detecciones que cumplen las condiciones de filtro.",
        },
        {
            id: "output-filtered-detections-fail" as OutputId,
            type: "array",
            label: "Detecciones que no cumplen",
            kind: "value",
            description: "Lista de detecciones que no cumplen las condiciones de filtro.",
        },
    ],
}
