import { nanoid } from "nanoid"

import { InputId, NodeSchema, OutputId } from "./common-types"

export const EMPTY_ARRAY: readonly never[] = []
export const EMPTY_SET: ReadonlySet<never> = new Set<never>()
export const EMPTY_MAP: ReadonlyMap<never, never> = new Map<never, never>()
export const EMPTY_OBJECT: Readonly<Record<string, never>> = Object.freeze({})

export const deepCopy = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T

export const createUniqueId = () => nanoid()

export const mapInputValues = <T>(schema: NodeSchema, getValue: (inputId: InputId) => T): T[] =>
    schema.inputs.map((input) => getValue(input.id))

export const mapOutputValues = <T>(schema: NodeSchema, getValue: (outputId: OutputId) => T): T[] =>
    schema.outputs.map((output) => getValue(output.id))

export interface ParsedSourceHandle {
    handleId: string
}
export interface ParsedTargetHandle {
    handleId: string
}

export const parseSourceHandle = (handle: string): ParsedSourceHandle => {
    const cleanHandle =
        handle.endsWith("-source") || handle.endsWith("-target")
            ? handle.slice(0, -7) // -7 es la longitud de '-source'
            : handle

    return {
        handleId: cleanHandle,
    }
}

export const parseTargetHandle = (handle: string): ParsedTargetHandle => {
    const cleanHandle =
        handle.endsWith("-target") || handle.endsWith("-source")
            ? handle.slice(0, -7) // -7 es la longitud de '-target'
            : handle

    return {
        handleId: cleanHandle,
    }
}

export const stringifySourceHandle = (handle: ParsedSourceHandle): string => `${handle.handleId}-source`
export const stringifyTargetHandle = (handle: ParsedTargetHandle): string => `${handle.handleId}-target`

export function groupBy<T, K extends keyof T>(iter: Iterable<T>, key: K): Map<T[K], T[]>
export function groupBy<T, K>(iter: Iterable<T>, selector: (item: T) => K): Map<K, T[]>
// eslint-disable-next-line prefer-arrow-functions/prefer-arrow-functions
export function groupBy<T>(iter: Iterable<T>, key: keyof T | ((item: T) => unknown)): Map<unknown, T[]> {
    const map = new Map<unknown, T[]>()

    if (typeof key === "function") {
        for (const item of iter) {
            const k = key(item)
            let list = map.get(k)
            if (list === undefined) {
                list = []
                map.set(k, list)
            }
            list.push(item)
        }
    } else {
        for (const item of iter) {
            const k = item[key]
            let list = map.get(k)
            if (list === undefined) {
                list = []
                map.set(k, list)
            }
            list.push(item)
        }
    }

    return map
}
