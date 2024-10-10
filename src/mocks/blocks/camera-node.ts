import { CategoryId, InputId, NodeGroupId, NodeSchema, OutputId, SchemaId } from "@/common/common-types"

import { Icons } from "@/components/Icons"

import { cameras } from "../resources/cameras"

export const cameraNode: NodeSchema = {
    schemaId: "camera-node" as SchemaId,
    name: "Cámara",
    category: "data-capture" as CategoryId,
    nodeGroup: "camera" as NodeGroupId,
    description: "Pide imágenes y detecciones de cierta cámara usando la nueva API de YOLO.",
    icon: Icons.camera,
    color: "#339fff",
    nodeType: "regularNode",
    inputs: [
        {
            id: "input-camera-name" as InputId,
            type: "string",
            kind: "dropdown",
            label: "Cámara",
            optional: false,
            options: cameras,
            preferredStyle: "dropdown",
            groups: [],
        },
    ],
    parameters: [
        {
            id: "input-camera-name" as parameterId,
            type: "string",
            kind: "dropdown",
            label: "Cámara",
            optional: false,
            options: cameras,
            preferredStyle: "dropdown",
            groups: [],
        },
    ],
    outputs: [
        {
            id: "output-detections" as OutputId,
            type: "array",
            label: "Detecciones",
            kind: "detections",
            description: "Lista de detecciones obtenidas de la cámara.",
        },
    ],
}
