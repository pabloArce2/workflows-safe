import { CategoryId, InputId, NodeGroupId, NodeSchema, OutputId, SchemaId } from "@/common/common-types"

import { Icons } from "@/components/Icons"

export const filterNode: NodeSchema = {
    schemaId: "filter-node" as SchemaId,
    name: "Filtrar detecciones",
    category: "data-processing" as CategoryId,
    nodeGroup: "detections" as NodeGroupId,
    description:
        "Filtra detecciones basadas en comparaciones aplicadas a los valores de las detecciones (confianza, clase, velocidad, etc.).",
    icon: Icons.filter,
    color: "#7A1223",
    nodeType: "regularNode",
    inputs: [
        {
            id: "input-detections" as InputId,
            type: "array",
            list: "detections",
            label: "Detecciones",
            optional: false,
            groups: [],
        },
        {
            id: "input-filter-conditions" as InputId,
            type: "object",
            kind: "json",
            label: "Condiciones de filtro",
            optional: false,
            groups: [],
        },
        {
            id: "input-filter-value" as InputId,
            type: "text",
            kind: "json",
            label: "Atributos de filtro",
            optional: false,
            groups: [],
        },
    ],
    outputs: [
        {
            id: "output-filtered-detections" as OutputId,
            type: "array",
            label: "Detecciones filtradas",
            kind: "list",
            description: "Lista de detecciones que cumplen las condiciones de filtro.",
        },
    ],
}
