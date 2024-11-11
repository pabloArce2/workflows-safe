import { CategoryId, InputId, NodeGroupId, NodeSchema, OutputId, SchemaId } from "@/common/common-types"

import { Icons } from "@/components/Icons"

export const NotificationOffSiteNode: NodeSchema = {
    schemaId: "notification-off-site" as SchemaId,
    name: "Notificación fuera de Instalación",
    category: "notification-management" as CategoryId,
    nodeGroup: "notification" as NodeGroupId,
    description: "Notificación para medios externos (Telegram, E-mail, plataforma SAFE).",
    icon: Icons.notification,
    color: "#2196F3", // Color azul para resaltar
    nodeType: "regularNode",
    inputValues: ["none"],
    outputValues: ["none"],
    inputs: [
        {
            id: "notification-type" as InputId,
            type: "string",
            kind: "dropdown",
            label: "Tipo de Notificación",
            optional: false,
            origin: "parameter",
            hideLabel: false,
            options: [
                { option: "Telegram", value: "telegram", type: "string" },
                { option: "E-mail", value: "email", type: "string" },
                { option: "SAFE", value: "safe", type: "string" },
            ],
            preferredStyle: "dropdown",
            groups: [],
        },
        {
            id: "telegram-phone" as InputId,
            type: "string",
            kind: "text",
            label: "Número de Teléfono",
            optional: false,
            condition: "notification-type === 'telegram'",
        },
        {
            id: "telegram-message" as InputId,
            type: "string",
            kind: "text",
            label: "Mensaje",
            optional: false,
            condition: "notification-type === 'telegram'",
        },
        {
            id: "telegram-image" as InputId,
            type: "string",
            kind: "dropdown",
            label: "Imagen (opcional)",
            optional: true,
            condition: "notification-type === 'telegram'",
            options: [
                // Example options; replace with actual variables or a dynamic list
                { option: "Imagen 1", value: "imagen_1", type: "string" },
                { option: "Imagen 2", value: "imagen_2", type: "string" },
            ],
            groups: [],
        },
    ],
    outputs: [],
}
