import { CategoryId, InputId, NodeGroupId, NodeSchema, OutputId, SchemaId } from "@/common/common-types"

import { Icons } from "@/components/Icons"

export const countNode: NodeSchema = {
    schemaId: "count-node" as SchemaId,
    name: "Contar detecciones",
    category: "data-processing" as CategoryId,
    nodeGroup: "detections" as NodeGroupId,
    description:
        "Cuenta las detecciones tras filtrar y determina si la alarma debe activarse en función de la cantidad.",
    icon: Icons.slidersVertical,
    color: "#9fff33",
    nodeType: "regularNode",
    inputs: [
        {
            id: "input-detections" as InputId,
            type: "array",
            kind: "detections",
            origin: "entry",
            label: "Detecciones",
            optional: false,
            addMore: true, // Indica que se pueden agregar más listas de detecciones
            hideLabel: false,
        },
        {
            id: "input-comparator" as InputId,
            type: "string",
            kind: "dropdown",
            origin: "parameter",
            label: "Operador de comparación",
            optional: false,
            options: [
                { option: "==", value: "==", type: "string" },
                { option: "!=", value: "!=", type: "string" },
                { option: ">", value: ">", type: "string" },
                { option: "<", value: "<", type: "string" },
                { option: "≥", value: "≥", type: "string" },
                { option: "≤", value: "≤", type: "string" },
            ],
            preferredStyle: "dropdown",
            groups: [],
        },
        {
            id: "input-threshold" as InputId,
            type: "number",
            kind: "number",
            label: "Umbral de detecciones",
            hideLabel: false,
            optional: false,
            origin: "parameter",
            def: 2,
            precision: 2,
            controlsStep: 2,
            hideTrailingZeros: true,
        },
    ],
    outputs: [
        {
            id: "output-alarm-trigger" as OutputId,
            type: "boolean",
            label: "Alarma activada",
            kind: "bool",
            description: "Indica si la alarma se activa en función del conteo de detecciones.",
        },
        {
            id: "output-detections-json" as OutputId,
            type: "json",
            label: "JSON de detecciones agrupadas",
            kind: "value",
            description: "Detecciones implicadas agrupadas por flujos, vacío si la alarma no se activa.",
        },
    ],
}
