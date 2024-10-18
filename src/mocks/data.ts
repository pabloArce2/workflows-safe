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
import { CustomCodeNode } from "./blocks/custom-code-node"
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
    CustomCodeNode,
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
                order: ["start-cycle-node"] as SchemaId[],
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
                name: "Nodos de Filtro y Procesamiento",
                order: ["filter-node", "associate-node", "distance-node", "count-node"] as SchemaId[],
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
        id: "notification-management" as CategoryId,
        name: "Gestión de Notificaciones",
        description: "Categoría para nodos que manejan notificaciones a dispositivos y servicios externos.",
        color: "#FF69B4", // Rosa
        groups: [
            {
                id: "notification" as NodeGroupId,
                category: "notification-management" as CategoryId,
                name: "Nodos de Notificación",
                order: ["notification-on-site", "notification-off-site"] as SchemaId[],
            },
        ],
    },
    {
        id: "custom-code" as CategoryId,
        name: "Código Personalizado",
        description: "Categoría para nodos que permiten a los usuarios escribir y ejecutar código personalizado.",
        color: "#8A2BE2", // Azul violeta
        groups: [
            {
                id: "custom-code-group" as NodeGroupId,
                category: "custom-code" as CategoryId,
                name: "Bloques de Código",
                order: ["custom-code-node"] as SchemaId[], // Añadir aquí el ID del nodo de código personalizado
            },
        ],
    },
]

export const nodes_test_data: BackendNodesResponse = {
    categories: initialCategories,
    nodes: initialNodesSchema,
}
