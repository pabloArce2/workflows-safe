import { CategoryId, InputId, NodeGroupId, NodeSchema, OutputId, SchemaId } from "@/common/common-types"

import { Icons } from "@/components/Icons"

// Adjust the import according to your project structure

export const alarmNode: NodeSchema = {
    schemaId: "alarm-manager" as SchemaId,
    name: "Gestor de Alarma",
    category: "alarm-management" as CategoryId,
    nodeGroup: "alarm" as NodeGroupId,
    description: "Gestor de alarmas que acumula eventos y determina si se debe disparar una alerta.",
    icon: Icons.clock,
    color: "#FF5733", // Color rojo para resaltar
    nodeType: "regularNode",
    sourceType: "variable",
    targetType: "single",
    inputValues: ["none"],
    outputValues: ["none"],
    inputs: [
        {
            id: "alarm-selection" as InputId,
            type: "string",
            kind: "dropdown",
            origin: "parameter",
            label: "Seleccionar Alarmas",
            optional: false,
            options: [
                { option: "alarma_fuego", value: "alarma_fuego", type: "string" },
                { option: "alarma_seguridad", value: "alarma_seguridad", type: "string" },
                { option: "alarma_temperatura", value: "alarma_temperatura", type: "string" },
            ],
            preferredStyle: "dropdown",
            groups: [],
        },
        {
            id: "cooldown" as InputId,
            type: "number",
            origin: "parameter",
            kind: "text",
            label: "Cooldown (segundos)",
            optional: false,
            hideLabel: false,
        },
        {
            id: "sensitivity" as InputId,
            type: "number",
            origin: "parameter",
            kind: "text",
            label: "Sensibilidad (%)",
            optional: false,
            hideLabel: false,
        },
    ],
    outputs: [],
}
