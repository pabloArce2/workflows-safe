import { CategoryId, InputId, NodeGroupId, NodeSchema, OutputId, SchemaId } from "@/common/common-types"

import { Icons } from "@/components/Icons"

export const NotificationOnSiteNode: NodeSchema = {
    schemaId: "notification-on-site" as SchemaId,
    name: "Notificación en Instalación",
    category: "notification-management" as CategoryId,
    nodeGroup: "control" as NodeGroupId,
    description: "Notificación para dispositivos físicos en la instalación (pantalla, PLC, altavoces, etc.).",
    icon: Icons.notification,
    color: "#4CAF50", // Color verde para resaltar
    nodeType: "regularNode",
    inputs: [
        {
            id: "notification-type" as InputId,
            type: "string",
            kind: "dropdown",
            label: "Tipo de Notificación",
            optional: false,
            options: [
                { option: "Pantalla", value: "pantalla", type: "string" },
                { option: "PLC", value: "plc", type: "string" },
                { option: "Altavoces", value: "altavoces", type: "string" },
                { option: "Relé", value: "rele", type: "string" },
                { option: "API local", value: "api_local", type: "string" },
                { option: "Proyector", value: "proyector", type: "string" },
            ],
            preferredStyle: "dropdown",
            groups: [],
        },
        {
            id: "plc-name" as InputId,
            type: "string",
            kind: "text",
            label: "Nombre",
            optional: false,
            condition: "notification-type === 'plc'",
        },
        {
            id: "plc-ip" as InputId,
            type: "string",
            kind: "text",
            label: "IP",
            optional: false,
            condition: "notification-type === 'plc'",
        },
        {
            id: "plc-port" as InputId,
            type: "number",
            kind: "text",
            label: "Puerto",
            optional: false,
            condition: "notification-type === 'plc'",
        },
        {
            id: "plc-signal" as InputId,
            type: "string",
            kind: "text",
            label: "Señal",
            optional: false,
            condition: "notification-type === 'plc'",
        },
        {
            id: "screen-name" as InputId,
            type: "string",
            kind: "text",
            label: "Nombre",
            optional: false,
            condition: "notification-type === 'pantalla'",
        },
        {
            id: "screen-video" as InputId,
            type: "file",
            kind: "file",
            label: "Vídeo",
            optional: false,
            condition: "notification-type === 'pantalla'",
            fileType: "video",
        },
    ],
    outputs: [],
}
