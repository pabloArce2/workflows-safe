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
    inputs: [
        {
            id: "input-primary-detections" as InputId,
            type: "array",
            kind: "detections",
            label: "Detecciones primarias",
            optional: false,
            groups: [],
        },
        {
            id: "input-secondary-detections" as InputId,
            type: "array",
            kind: "detections",
            label: "Detecciones secundarias",
            optional: false,
            groups: [],
        },
        {
            id: "input-distance-threshold" as InputId,
            type: "number",
            kind: "number",
            label: "Umbral de distancia",
            optional: false,
            groups: [],
        },
    ],
    outputs: [
        {
            id: "output-distance-filtered-detections" as OutputId,
            type: "array",
            label: "Detecciones filtradas por distancia",
            kind: "list",
            description:
                "Detecciones primarias que cumplen el criterio de distancia respecto a las detecciones secundarias.",
        },
    ],
}
