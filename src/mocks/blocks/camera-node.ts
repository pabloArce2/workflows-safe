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
            origin: "parameter",
            label: "Cámara",
            optional: false,
            options: cameras,
            preferredStyle: "dropdown",
            groups: [],
        },
    ],
    outputs: [
        {
            id: "output-image-name" as OutputId,
            type: "string",
            label: "Nombre de la imagen de salida",
            kind: "value",
            description: "El nombre del archivo de la imagen obtenida de la cámara.",
        },
    ],
}
