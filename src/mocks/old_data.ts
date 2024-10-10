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
    // {
    //     schemaId: "trigger-node" as SchemaId,
    //     name: "Trigger",
    //     category: "control-flow" as CategoryId,
    //     nodeGroup: "control" as NodeGroupId,
    //     icon: Icons.activity,
    //     color: "#228B22",
    //     description:
    //         "Trigger para comenzar el ciclo o no. Se encarga de comprobar el trigger hasta que reciba la señal.",
    //     nodeType: "regularNode",
    //     inputs: [
    //         {
    //             id: "plc-type" as InputId,
    //             type: "string",
    //             kind: "dropdown",
    //             label: "Tipo de trigger",
    //             optional: false,
    //             options: [
    //                 { option: "PLC", value: "PLC", type: "string" },
    //                 { option: "AI", value: "AI", type: "string" },
    //                 { option: "Hardware", value: "Hardware", type: "string" },
    //             ],
    //             preferredStyle: "dropdown",
    //             groups: [],
    //         },
    //         // Nota: Los detalles específicos de cada opción de trigger se manejarían en la lógica de la aplicación
    //     ],
    //     outputs: [],
    // },
    // Nodo Cámara
    // {
    //     schemaId: "camera-node" as SchemaId,
    //     name: "Tomar Imagen",
    //     category: "data-capture" as CategoryId,
    //     nodeGroup: "camera" as NodeGroupId,
    //     description: "Este bloque es el encargado de sacar imágenes.",
    //     icon: Icons.camera,
    //     color: "#FF7F50",
    //     nodeType: "regularNode",
    //     inputs: [
    //         {
    //             id: "input-camera-name" as InputId,
    //             type: "string",
    //             kind: "dropdown",
    //             label: "Cámara",
    //             optional: false,
    //             options: [{ option: "camera_cenital", value: "camera_cenital", type: "string" }], // Las opciones se llenarían con las cámaras disponibles en el proyecto
    //             preferredStyle: "dropdown",
    //             groups: [],
    //         },
    //     ],
    //     outputs: [
    //         {
    //             id: "output-camera-name" as OutputId,
    //             type: "string",
    //             label: "Nombre de la Imagen",
    //             kind: "text",
    //             description: "Variable global que contiene la ruta de la imagen capturada.",
    //         },
    //     ],
    // },
    // Nodo AI
    ////////////////////////////////////////////////////////////////////

    {
        schemaId: "ia-node" as SchemaId,
        name: "Solicitar cámara",
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
                options: [
                    { option: "camera_cenital", value: "camera_cenital", type: "string" },
                    { option: "camera_lateral", value: "camera_lateral", type: "string" },
                    { option: "camera_interior", value: "camera_interior", type: "string" },
                    { option: "sensor_movimiento", value: "sensor_movimiento", type: "string" },
                    { option: "sensor_temperatura", value: "sensor_temperatura", type: "string" },
                    { option: "microfono", value: "microfono", type: "string" },
                    { option: "camara_termica", value: "camara_termica", type: "string" },
                    { option: "sensor_humedad", value: "sensor_humedad", type: "string" },
                    { option: "sensor_gas", value: "sensor_gas", type: "string" },
                    { option: "circuito_cerrado", value: "circuito_cerrado", type: "string" },
                    { option: "dron", value: "dron", type: "string" },
                    { option: "cámara_RGB", value: "cámara_RGB", type: "string" },
                    { option: "cámara_360", value: "cámara_360", type: "string" },
                    { option: "cámara_noche", value: "cámara_noche", type: "string" },
                    { option: "sensor_acelerometro", value: "sensor_acelerometro", type: "string" },
                ],
                preferredStyle: "dropdown",
                groups: [],
            },
        ],
        outputs: [
            {
                id: "output-detections" as OutputId,
                type: "array",
                label: "Detecciones",
                kind: "dict",
                description: "Lista de detecciones obtenidas de la cámara.",
            },
        ],
    },

    {
        schemaId: "alarm-manager" as SchemaId,
        name: "Gestor de Alarma",
        category: "alarm-management" as CategoryId,
        nodeGroup: "alarm" as NodeGroupId,
        description: "Gestor de alarmas que acumula eventos y determina si se debe disparar una alerta.",
        icon: Icons.clock,
        color: "#FF5733", // Color rojo para resaltar
        nodeType: "regularNode",
        inputs: [
            {
                id: "alarm-selection" as InputId,
                type: "string",
                kind: "dropdown",
                label: "Seleccionar Alarmas",
                optional: false,
                options: [
                    { option: "alarma_fuego", value: "alarma_fuego", type: "string" },
                    { option: "alarma_seguridad", value: "alarma_seguridad", type: "string" },
                    { option: "alarma_temperatura", value: "alarma_temperatura", type: "string" },
                ], // Opciones de alarmas disponibles en la interfaz
                preferredStyle: "dropdown",
                groups: [],
            },
            {
                id: "cooldown" as InputId,
                type: "number",
                kind: "text",
                label: "Cooldown (segundos)",
                optional: false,
                hideLabel: false,
            },
            {
                id: "sensitivity" as InputId,
                type: "number",
                kind: "text",
                label: "Sensibilidad (%)",
                optional: false,
                hideLabel: false,
            },
            {
                id: "input-json" as InputId,
                type: "json",
                kind: "text",
                label: "Input JSON de Implicados",
                optional: false,
                hideLabel: false,
            },
        ],
        outputs: [
            {
                id: "output-json" as OutputId,
                type: "json",
                label: "Output JSON de Alerta",
                kind: "value",
                description: "JSON a postear en la interfaz en caso de concluir que debe postearse algo.",
            },
        ],
    },

    // {
    //     schemaId: "ai-node" as SchemaId,
    //     name: "Inferencia AI",
    //     category: "ai-processing" as CategoryId,
    //     nodeGroup: "ai" as NodeGroupId,
    //     description: "Se encarga de hacer una inferencia en un modelo de AI.",
    //     icon: Icons.brainCircuit,
    //     color: "#6B21A8",
    //     nodeType: "regularNode",
    //     inputs: [
    //         {
    //             id: "model-name" as InputId,
    //             type: "string",
    //             kind: "dropdown",
    //             label: "Modelo de AI",
    //             optional: false,
    //             options: [{ option: "defectos_goma", value: "defectos_goma", type: "string" }], // Las opciones se llenarían con los modelos de AI disponibles en el proyecto
    //             preferredStyle: "dropdown",
    //             groups: [],
    //         },
    //         {
    //             id: "model-image-name" as InputId,
    //             type: "string",
    //             kind: "text",
    //             label: "Nombre de la Imagen",
    //             optional: false,
    //             hideLabel: false,
    //         },
    //     ],
    //     outputs: [
    //         /* {
    //           id: 2 as OutputId,
    //           type: "dict",
    //           label: "Nombre de las Detecciones",
    //           kind: "value",
    //           description: "Variable global que contiene las detecciones de AI.",
    //       }, */
    //     ],
    // },
    {
        schemaId: "filter-node" as SchemaId,
        name: "Filtrar detecciones",
        category: "data-processing" as CategoryId,
        nodeGroup: "detections" as NodeGroupId,
        description:
            "Filtra detecciones basadas en comparaciones aplicadas a los valores de las detecciones (confianza, clase, velocidad, etc.).",
        icon: Icons.filter,
        color: "#7A1223",
        nodeType: "regularNode",
        inputs: [
            {
                id: "input-detections" as InputId,
                type: "array",
                list: "detections",
                label: "Detecciones",
                optional: false,
                groups: [],
            },
            {
                id: "input-filter-conditions" as InputId,
                type: "object",
                kind: "json",
                label: "Condiciones de filtro",
                optional: false,
                groups: [],
            },
            {
                id: "input-filter-value" as InputId,
                type: "text",
                kind: "json",
                label: "Atributos de filtro",
                optional: false,
                groups: [],
            },
        ],
        outputs: [
            {
                id: "output-filtered-detections" as OutputId,
                type: "array",
                label: "Detecciones filtradas",
                kind: "list",
                description: "Lista de detecciones que cumplen las condiciones de filtro.",
            },
        ],
    },
    // {
    //     schemaId: "associate-node",
    //     name: "Asociar detecciones",
    //     category: "data-processing",
    //     nodeGroup: "detections",
    //     description: "Asocia unas detecciones con otras. Por ejemplo, asociar personas con cascos.",
    //     icon: Icons.link,
    //     color: "#48D1CC",
    //     nodeType: "regularNode",
    //     inputs: [
    //         {
    //             id: "input-primary-detections",
    //             type: "array",
    //             kind: "list",
    //             label: "Detecciones primarias",
    //             optional: false,
    //             groups: [],
    //         },
    //         {
    //             id: "input-secondary-detections",
    //             type: "array",
    //             kind: "list",
    //             label: "Detecciones secundarias",
    //             optional: false,
    //             groups: [],
    //         },
    //     ],
    //     outputs: [
    //         {
    //             id: "output-associated-detections",
    //             type: "array",
    //             label: "Detecciones asociadas",
    //             kind: "list",
    //             description: "Detecciones primarias con sus detecciones secundarias asociadas.",
    //         },
    //     ],
    // },
    {
        schemaId: "distance-node",
        name: "Filtrar por distancia",
        category: "data-processing",
        nodeGroup: "detections",
        description: "Filtra las detecciones basadas en la distancia entre clases y un umbral.",
        icon: Icons.ruler,
        color: "#20B2AA",
        nodeType: "regularNode",
        inputs: [
            {
                id: "input-primary-detections",
                type: "array",
                kind: "detections",
                label: "Detecciones primarias",
                optional: false,
                groups: [],
            },
            {
                id: "input-secondary-detections",
                type: "array",
                kind: "detections",
                label: "Detecciones secundarias",
                optional: false,
                groups: [],
            },
            {
                id: "input-distance-threshold",
                type: "number",
                kind: "number",
                label: "Umbral de distancia",
                optional: false,
                groups: [],
            },
        ],
        outputs: [
            {
                id: "output-distance-filtered-detections",
                type: "array",
                label: "Detecciones filtradas por distancia",
                kind: "list",
                description:
                    "Detecciones primarias que cumplen el criterio de distancia respecto a las detecciones secundarias.",
            },
        ],
    },
    {
        schemaId: "count-node" as SchemaId,
        name: "Contar detecciones",
        category: "control-flow" as CategoryId,
        nodeGroup: "control" as NodeGroupId,
        description:
            "Cuenta las detecciones tras filtrar y determina si la alarma debe activarse en función de la cantidad.",
        icon: Icons.slidersVertical,
        color: "#9fff33",
        nodeType: "regularNode",
        inputs: [
            {
                id: "input-detections" as InputId,
                type: "array",
                kind: "detections",
                label: "Detecciones",
                optional: false,
                hideLabel: false,
            },
            {
                id: "input-threshold" as InputId,
                type: "number",
                kind: "number",
                label: "Umbral de detecciones",
                hideLabel: false,
                optional: false,
                def: 2,
                precision: 2,
                controlsStep: 2,
                hideTrailingZeros: true,
            },
            {
                id: "input-comparator" as InputId,
                type: "string",
                kind: "dropdown",
                label: "Operador de comparación",
                optional: false,
                options: [
                    { option: "==", value: "==", type: "string" },
                    { option: "!=", value: "!=", type: "string" },
                    { option: ">", value: ">", type: "string" },
                    { option: "<", value: "<", type: "string" },
                ],
                preferredStyle: "dropdown",
                groups: [],
            },
            {
                id: "input-count-value" as InputId,
                type: "text",
                kind: "json",
                label: "Atributos a contar",
                optional: false,
                groups: [],
            },
        ],
        outputs: [
            {
                id: "output-alarm-trigger" as OutputId,
                type: "boolean",
                label: "Alarma activada",
                kind: "bool",
                description: "Indica si la alarma se activa en función del conteo de detecciones.",
            },
        ],
    },
    ////////////////////////////////////////////////////////////////////
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
                options: [
                    { option: "defectos_goma", value: "defectos_goma", type: "string" },
                    { option: "calidad_superficie", value: "calidad_superficie", type: "string" },
                    { option: "deteccion_grietas", value: "deteccion_grietas", type: "string" },
                    { option: "clasificacion_materiales", value: "clasificacion_materiales", type: "string" },
                    { option: "inspeccion_soldaduras", value: "inspeccion_soldaduras", type: "string" },
                    { option: "analisis_desgaste", value: "analisis_desgaste", type: "string" },
                    { option: "deteccion_corrosion", value: "deteccion_corrosion", type: "string" },
                    { option: "control_dimensional", value: "control_dimensional", type: "string" },
                    { option: "identificacion_piezas", value: "identificacion_piezas", type: "string" },
                    { option: "inspeccion_embalaje", value: "inspeccion_embalaje", type: "string" },
                ],
                preferredStyle: "dropdown",
                groups: [],
            },
            {
                id: "camera-name" as InputId,
                type: "string",
                kind: "camera",
                label: "Nombre de la camara",
                optional: false,
                hideLabel: false,
            },
        ],
        outputs: [
            {
                id: "camera_detections" as OutputId,
                type: "detections",
                label: "Nombre de las Detecciones",
                kind: "value",
                description: "Variable global que contiene las detecciones de AI.",
            },
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
    // {
    //     id: "plc-operations" as CategoryId,
    //     name: "Operaciones PLC",
    //     description: "Categoría para nodos que interactúan con PLCs, incluyendo lectura y escritura de señales.",
    //     color: "#FF8C00", // Naranja oscuro
    //     groups: [
    //         {
    //             id: "plc" as NodeGroupId,
    //             category: "plc-operations" as CategoryId,
    //             name: "Interacción con PLC",
    //             order: ["plc-read-node", "plc-write-node"] as SchemaId[],
    //         },
    //     ],
    // },
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
