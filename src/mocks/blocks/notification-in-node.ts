import { CategoryId, InputId, NodeGroupId, NodeSchema, OutputId, SchemaId } from "@/common/common-types"

import { Icons } from "@/components/Icons"

export const NotificationOnSiteNode: NodeSchema = {
    schemaId: "notification-on-site" as SchemaId,
    name: "Notificación en Instalación",
    category: "notification-management" as CategoryId,
    nodeGroup: "notification" as NodeGroupId,
    description: "Notificación para dispositivos físicos en la instalación (pantalla, PLC, altavoces, etc.).",
    icon: Icons.notification,
    color: "#4CAF50", // Color verde para resaltar
    nodeType: "onlyTarget",
    sourceType: "none",
    targetType: "single",
    inputValues: ["none"],
    outputValues: ["none"],

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
            origin: "parameter", // Added origin property as required by the DropDownInput type
        },
        {
            id: "plc-name" as InputId,
            type: "string",
            kind: "text",
            label: "Nombre",
            optional: false,
            origin: "parameter", // Added origin property as required by the DropDownInput type
            hideLabel: false, // Added hideLabel property as required by the TextInput type
        },
        {
            id: "plc-ip" as InputId,
            type: "string",
            kind: "text",
            label: "IP",
            optional: false,
            origin: "parameter", // Added origin property as required by the DropDownInput type
            hideLabel: false, // Added hideLabel property as required by the TextInput type
        },
        {
            id: "plc-port" as InputId,
            type: "number",
            kind: "text",
            hideLabel: false, // Added hideLabel property as required by the TextInput type
            label: "Puerto",
            optional: false,
            origin: "parameter", // Added origin property as required by the DropDownInput type
        },
        {
            id: "plc-signal" as InputId,
            type: "string",
            kind: "text",
            label: "Señal",
            optional: false,
            origin: "parameter", // Added origin property as required by the DropDownInput type
            hideLabel: false,
        },
        {
            id: "screen-name" as InputId,
            type: "string",
            kind: "text",
            label: "Nombre",
            optional: false,
            origin: "parameter",
            hideLabel: false,
        },
        {
            id: "screen-video" as InputId,
            type: "custom-code",
            kind: "custom-code",
            label: "Vídeo",
            optional: false,
            origin: "parameter",
            language: "javascript",
            multiline: true,
            hideLabel: false,
        },
    ],
    outputs: [],
}
