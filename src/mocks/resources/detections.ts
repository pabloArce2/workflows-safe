// detectionExamples.js

export const detectionExamples = [
    {
        id_detection: "detection_001", // Id único de la detección
        id_tracking: "tracking_001", // Id de la detección que la identifica en varias posibles detecciones
        object: "person", // Clase de la detección
        bbox: {
            // Puntos de la detección (ejemplo de coordenadas en formato [x_min, y_min, x_max, y_max])
            x_min: 100,
            y_min: 150,
            x_max: 300,
            y_max: 400,
        },
        coord: {
            // Coordenadas relativas respecto al punto de origen
            x: 200,
            y: 250,
        },
        speed: 3.5, // Velocidad relativa (ejemplo en unidades por segundo)
        zones: ["zone_1", "zone_2"], // Zonas en las que se encuentra
        distances: {
            // Distancias a otros objetos o puntos de interés
            to_object_1: 5.2,
            to_object_2: 10.5,
        },
        associated: ["object_1", "object_2"], // Objetos con los que está asociado
        posture: ["standing", "walking"], // Posibles posturas
    },
    {
        id_detection: "detection_002",
        id_tracking: "tracking_002",
        object: "car",
        bbox: {
            x_min: 120,
            y_min: 170,
            x_max: 320,
            y_max: 420,
        },
        coord: {
            x: 250,
            y: 300,
        },
        speed: 12.1,
        zones: ["zone_2", "zone_3"],
        distances: {
            to_object_1: 3.0,
            to_object_2: 8.0,
        },
        associated: ["object_3", "object_4"],
        posture: ["stopped", "moving"],
    },
    {
        id_detection: "detection_003",
        id_tracking: "tracking_001",
        object: "bicycle",
        bbox: {
            x_min: 90,
            y_min: 130,
            x_max: 310,
            y_max: 390,
        },
        coord: {
            x: 150,
            y: 220,
        },
        speed: 5.8,
        zones: ["zone_1", "zone_4"],
        distances: {
            to_object_1: 6.5,
            to_object_2: 9.3,
        },
        associated: ["object_5"],
        posture: ["stationary", "riding"],
    },
    {
        id_detection: "detection_004",
        id_tracking: "tracking_003",
        object: "dog",
        bbox: {
            x_min: 200,
            y_min: 180,
            x_max: 400,
            y_max: 480,
        },
        coord: {
            x: 250,
            y: 350,
        },
        speed: 4.2,
        zones: ["zone_3"],
        distances: {
            to_object_1: 1.2,
            to_object_2: 7.5,
        },
        associated: ["object_6"],
        posture: ["sitting", "running"],
    },
    {
        id_detection: "detection_005",
        id_tracking: "tracking_004",
        object: "cat",
        bbox: {
            x_min: 50,
            y_min: 50,
            x_max: 200,
            y_max: 200,
        },
        coord: {
            x: 120,
            y: 150,
        },
        speed: 2.0,
        zones: ["zone_1", "zone_2"],
        distances: {
            to_object_1: 5.5,
            to_object_2: 4.0,
        },
        associated: ["object_7"],
        posture: ["lying", "playing"],
    },
]
