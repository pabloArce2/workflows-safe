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

import { Icons } from "@/components/Icons"

// Nota: Se omitió la importación y uso de customAlphabet de nanoid ya que los ID serán más descriptivos.

const initialNodesSchema: NodeSchema[] = [
    {
        schemaId: "start-cycle-node" as SchemaId,
        name: "Inicio de Ciclo",
        category: "control-flow" as CategoryId,
        nodeGroup: "control" as NodeGroupId,
        description: "Marca el inicio del ciclo de procesos.",
        nodeType: "regularNode",
        icon: Icons.circlePlay,
        inputs: [], // El nodo de inicio generalmente no tiene inputs
        outputs: [
            // Puedes definir los outputs según lo necesites.
            // Por ejemplo, si este nodo solo inicia el flujo sin pasar datos específicos, puede que no necesite outputs detallados.
            // Alternativamente, si pasas un identificador de proceso o algún otro dato, aquí iría la definición.
        ],
    },
    // Nodo Trigger
    {
        schemaId: "trigger-node" as SchemaId,
        name: "Trigger",
        category: "control-flow" as CategoryId,
        nodeGroup: "control" as NodeGroupId,
        icon: Icons.activity,
        color: "#228B22",
        description:
            "Trigger para comenzar el ciclo o no. Se encarga de comprobar el trigger hasta que reciba la señal.",
        nodeType: "regularNode",
        inputs: [
            {
                id: "plc-type" as InputId,
                type: "string",
                kind: "dropdown",
                label: "Tipo de trigger",
                optional: false,
                options: [
                    { option: "PLC", value: "PLC", type: "string" },
                    { option: "AI", value: "AI", type: "string" },
                    { option: "Hardware", value: "Hardware", type: "string" },
                ],
                preferredStyle: "dropdown",
                groups: [],
            },
            // Nota: Los detalles específicos de cada opción de trigger se manejarían en la lógica de la aplicación
        ],
        outputs: [],
    },
    // Nodo Cámara
    {
        schemaId: "camera-node" as SchemaId,
        name: "Tomar Imagen",
        category: "data-capture" as CategoryId,
        nodeGroup: "camera" as NodeGroupId,
        description: "Este bloque es el encargado de sacar imágenes.",
        icon: Icons.camera,
        color: "#FF7F50",
        nodeType: "regularNode",
        inputs: [
            {
                id: "input-camera-name" as InputId,
                type: "string",
                kind: "dropdown",
                label: "Cámara",
                optional: false,
                options: [{ option: "camera_cenital", value: "camera_cenital", type: "string" }], // Las opciones se llenarían con las cámaras disponibles en el proyecto
                preferredStyle: "dropdown",
                groups: [],
            },
        ],
        outputs: [
            {
                id: "output-camera-name" as OutputId,
                type: "string",
                label: "Nombre de la Imagen",
                kind: "text",
                description: "Variable global que contiene la ruta de la imagen capturada.",
            },
        ],
    },
    // Nodo AI
    {
        schemaId: "ai-node" as SchemaId,
        name: "Inferencia AI",
        category: "ai-processing" as CategoryId,
        nodeGroup: "ai" as NodeGroupId,
        description: "Se encarga de hacer una inferencia en un modelo de AI.",
        icon: Icons.brainCircuit,
        color: "#6B21A8",
        nodeType: "regularNode",
        inputs: [
            {
                id: "model-name" as InputId,
                type: "string",
                kind: "dropdown",
                label: "Modelo de AI",
                optional: false,
                options: [{ option: "defectos_goma", value: "defectos_goma", type: "string" }], // Las opciones se llenarían con los modelos de AI disponibles en el proyecto
                preferredStyle: "dropdown",
                groups: [],
            },
            {
                id: "model-image-name" as InputId,
                type: "string",
                kind: "text",
                label: "Nombre de la Imagen",
                optional: false,
                hideLabel: false,
            },
        ],
        outputs: [
            /* {
                id: 2 as OutputId,
                type: "dict",
                label: "Nombre de las Detecciones",
                kind: "value",
                description: "Variable global que contiene las detecciones de AI.",
            }, */
        ],
    },
    // Nodo PLC Read
    {
        schemaId: "plc-read-node" as SchemaId,
        name: "PLC Read",
        category: "plc-operations" as CategoryId,
        nodeGroup: "plc" as NodeGroupId,
        description: "Lee una señal de un PLC.",
        icon: Icons.binary,
        color: "#0D99FF",
        nodeType: "regularNode",
        inputs: [
            {
                id: "plc" as InputId,
                type: "string",
                kind: "dropdown",
                label: "PLC",
                optional: false,
                options: [], // Las opciones se llenarían con los PLCs disponibles en el proyecto
                preferredStyle: "dropdown",
                groups: [],
            },
            {
                id: "signal" as InputId,
                type: "string",
                kind: "dropdown",
                label: "Señal",
                optional: false,
                options: [], // Las opciones se llenarían con las señales disponibles del PLC seleccionado
                preferredStyle: "dropdown",
                groups: [],
            },
        ],
        outputs: [
            {
                id: "" as OutputId,
                type: "number",
                label: "Nombre del Valor Leído",
                kind: "text",
                description: "Variable global que contiene el valor leído del PLC.",
            },
        ],
    },
    // Nodo PLC Write
    {
        schemaId: "plc-write-node" as SchemaId,
        name: "PLC Write",
        category: "plc-operations" as CategoryId,
        nodeGroup: "plc" as NodeGroupId,
        description: "Escribe una señal en un PLC.",
        icon: Icons.binary,
        color: "#E10F33",
        nodeType: "regularNode",
        inputs: [
            {
                id: "plc" as InputId,
                type: "string",
                kind: "dropdown",
                label: "PLC",
                optional: false,
                options: [{ option: "plc_1", value: "plc_1", type: "string" }], // Las opciones se llenarían con los PLCs disponibles en el proyecto
                preferredStyle: "dropdown",
                groups: [],
            },
            {
                id: "signal" as InputId,
                type: "string",
                kind: "dropdown",
                label: "Señal",
                optional: false,
                options: [
                    { option: "0", value: "0", type: "number" },
                    { option: "1", value: "1", type: "number" },
                ], // Las opciones se llenarían con las señales disponibles del PLC seleccionado
                preferredStyle: "dropdown",
                groups: [],
            },
            // La lógica para manejar diferentes tipos de valores (string, bool, number) se implementaría en la aplicación
        ],
        outputs: [],
    },
    // Bloque FIN DE CICLO
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
            {
                id: "detections" as InputId,
                type: "string",
                kind: "text",
                label: "Detecciones y Foto",
                optional: false,
                hideLabel: false,
            },
            {
                id: "result" as InputId,
                type: "number",
                kind: "dropdown",
                label: "Resultado",
                optional: false,
                options: [
                    { option: "ko", value: "0", type: "number" },
                    { option: "ok", value: "1", type: "number" },
                    { option: "rework", value: "2", type: "number" },
                ],
                preferredStyle: "dropdown",
                groups: [],
            },
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
        id: "plc-operations" as CategoryId,
        name: "Operaciones PLC",
        description: "Categoría para nodos que interactúan con PLCs, incluyendo lectura y escritura de señales.",
        color: "#FF8C00", // Naranja oscuro
        groups: [
            {
                id: "plc" as NodeGroupId,
                category: "plc-operations" as CategoryId,
                name: "Interacción con PLC",
                order: ["plc-read-node", "plc-write-node"] as SchemaId[],
            },
        ],
    },
]

export const nodes_test_data: BackendNodesResponse = {
    categories: initialCategories,
    nodes: initialNodesSchema,
}
