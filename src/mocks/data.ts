import {
    Category,
    CategoryId,
    DropDownInput,
    InputId,
    NodeGroupId,
    NodeSchema,
    OutputId,
    SchemaId,
    TextInput,
} from "@/common/common-types"
import { ExpressionJson } from "@/common/json"
import { BackendNodesResponse } from "@/context/BackendContext"
import { boolean } from "zod"

import { Icons } from "@/components/Icons"

import { aiNode } from "./blocks/ai-node"
import { alarmNode } from "./blocks/alarm-node"
import { cameraNode } from "./blocks/camera-node"
import { countNode } from "./blocks/count-node"
import { distanceNode } from "./blocks/distances-node"
import { filterNode } from "./blocks/filter-node"
import { NotificationOnSiteNode } from "./blocks/notification-in-node"
import { NotificationOffSiteNode } from "./blocks/notification-out-node"
import { startNode } from "./blocks/start-node"
import { cameras } from "./resources/cameras"

// Nota: Se omitió la importación y uso de customAlphabet de nanoid ya que los ID serán más descriptivos.

const initialNodesSchema: NodeSchema[] = [
    startNode,
    cameraNode,
    alarmNode,
    filterNode,
    distanceNode,
    countNode,
    aiNode,
    NotificationOnSiteNode,
    NotificationOffSiteNode,

    {
        schemaId: "end-cycle-node" as SchemaId,
        name: "Fin de Ciclo",
        category: "control-flow" as CategoryId,
        nodeGroup: "control" as NodeGroupId,
        description: "Indica visualmente que el ciclo se ha acabado.",
        icon: Icons.target,
        color: "#FFAC2F",
        nodeType: "regularNode",
        inputs: [
            // {
            //     id: "detections" as InputId,
            //     type: "string",
            //     kind: "text",
            //     label: "Detecciones y Foto",
            //     optional: false,
            //     hideLabel: false,
            // },
            // {
            //     id: "result" as InputId,
            //     type: "number",
            //     kind: "dropdown",
            //     label: "Resultado",
            //     optional: false,
            //     options: [
            //         { option: "ko", value: "0", type: "number" },
            //         { option: "ok", value: "1", type: "number" },
            //         { option: "rework", value: "2", type: "number" },
            //     ],
            //     preferredStyle: "dropdown",
            //     groups: [],
            // },
        ],
        outputs: [],
    },
]

export const initialCategories: Category[] = [
    {
        id: "control-flow" as CategoryId,
        name: "Control de Flujo",
        description: "Categoría para nodos que controlan el flujo del proceso, como triggers y finales de ciclo.",
        color: "#FFD700", // Dorado
        groups: [
            {
                id: "control" as NodeGroupId,
                category: "control-flow" as CategoryId,
                name: "Nodos de Control",
                order: ["trigger-node", "end-cycle-node", "start-cycle-node"] as SchemaId[],
            },
        ],
    },
    {
        id: "alarm-management" as CategoryId,
        name: "Gestión de Alarmas",
        description: "Categoría para nodos que gestionan y procesan alarmas.",
        color: "#FF4500", // Naranja rojizo
        groups: [
            {
                id: "alarm" as NodeGroupId,
                category: "alarm-management" as CategoryId,
                name: "Nodos de Alarma",
                order: ["alarm-manager"] as SchemaId[], // Añadir el bloque gestor de alarma aquí
            },
        ],
    },
    {
        id: "data-capture" as CategoryId,
        name: "Captura de Datos",
        description: "Categoría para nodos relacionados con la captura de datos, como cámaras.",
        color: "#00BFFF", // Azul cielo
        groups: [
            {
                id: "camera" as NodeGroupId,
                category: "data-capture" as CategoryId,
                name: "Cámaras",
                order: ["camera-node"] as SchemaId[],
            },
        ],
    },
    {
        id: "ai-processing" as CategoryId,
        name: "Procesamiento AI",
        description: "Categoría para nodos que realizan procesamiento utilizando inteligencia artificial.",
        color: "#32CD32", // Lima verde
        groups: [
            {
                id: "ai" as NodeGroupId,
                category: "ai-processing" as CategoryId,
                name: "Inferencia AI",
                order: ["ai-node"] as SchemaId[],
            },
        ],
    },
    {
        id: "data-processing" as CategoryId,
        name: "Procesamiento de Datos",
        description: "Categoría para nodos que procesan y transforman datos de las detecciones.",
        color: "#32CD32", // Verde Lima
        groups: [
            {
                id: "detections" as NodeGroupId,
                category: "data-processing" as CategoryId,
                name: "Nodos de Detección y Procesamiento",
                order: ["filter-node", "associate-node", "distance-node", "count-node"] as SchemaId[],
            },
        ],
    },
]

export const nodes_test_data: BackendNodesResponse = {
    categories: initialCategories,
    nodes: initialNodesSchema,
}
