import { LucideIcon } from "lucide-react"

import { ExpressionJson } from "./json"

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>
export type GetSetState<T> = readonly [T, SetState<T>]

export type NodeType = "regularNode" | "newIterator" | "collector" | "onlyTarget" | "onlySource"

export type Mutable<T> = { -readonly [P in keyof T]: T[P] }
export type CategoryId = string & { readonly __categoryId: never }
export interface Category {
  readonly id: CategoryId
  readonly name: string
  readonly description: string
  readonly icon?: string
  readonly color: string
  readonly groups: readonly NodeGroup[]
}

export type SchemaId = string & { readonly __schemaId: never }
export type InputId = string & { readonly __inputId: never }
export type OutputId = string & { readonly __outputId: never }
export type InputValue = InputSchemaValue | undefined
export type InputSchemaValue = string | number

export type InputData = Readonly<Record<InputId, InputValue>>
export type InputHeight = Readonly<Record<InputId, number>>
export type OutputData = Readonly<Record<OutputId, unknown>>
export type OutputHeight = Readonly<Record<OutputId, number>>
export type OutputTypes = Readonly<Partial<Record<OutputId, ExpressionJson | null>>>
//export type GroupState = Readonly<Record<GroupId, unknown>>

export interface NodeSchema {
  readonly schemaId: SchemaId
  readonly name: string
  readonly category: any
  readonly nodeGroup: NodeGroupId
  readonly description: string
  //readonly seeAlso: readonly SchemaId[]
  readonly color?: string
  readonly icon?: LucideIcon
  readonly nodeType: NodeType
  readonly inputs: readonly Input[]
  readonly outputs: readonly Output[]
  //readonly groupLayout: readonly (InputId | Group)[]
  //readonly hasSideEffects: boolean
  //readonly deprecated: boolean
  //readonly features: any //readonly FeatureId[]
}

export interface NodeData {
  readonly id: string
  readonly schemaId: SchemaId
  readonly inputData: InputData
}
export interface EdgeData {
  sourceX?: number
  sourceY?: number
  targetX?: number
  targetY?: number
}

export type NodeGroupId = string & { readonly __nodeGroupId: never }
export interface NodeGroup {
  readonly id: NodeGroupId
  readonly category: CategoryId
  readonly name: string
  readonly order: readonly SchemaId[]
}

export type Condition = AndCondition | OrCondition | NotCondition | EnumCondition | TypeCondition
export interface AndCondition {
  readonly kind: "and"
  readonly items: readonly Condition[]
}
export interface OrCondition {
  readonly kind: "or"
  readonly items: readonly Condition[]
}
export interface NotCondition {
  readonly kind: "not"
  readonly condition: Condition
}
export interface EnumCondition {
  readonly kind: "enum"
  readonly enum: InputId
  readonly values: readonly InputSchemaValue[] | InputSchemaValue
}
export interface TypeCondition {
  readonly kind: "type"
  readonly input: InputId
  readonly condition: ExpressionJson
  readonly ifNotConnected: boolean
}

interface InputBase {
  readonly id: InputId
  readonly type: ExpressionJson
  /**
   * A list of input conversions. Before checking for compatibility, the type
   * system will attempt to convert any assigned type using input conversions.
   *
   * This can be used to implement e.g. number rounding or type wrapping for
   * edges.
   */

  readonly adapt?: ExpressionJson | null
  readonly typeDefinitions?: string | null
  readonly kind: InputKind
  readonly label: string
  readonly optional: boolean
  readonly description?: string
  readonly hint?: boolean
  readonly fused?: IOFusion | null
}

export interface IOFusion {
  readonly outputId: OutputId
}

export interface InputOption {
  option: string
  value: InputSchemaValue
  type?: ExpressionJson
}
export type DropDownStyle = "dropdown" | "checkbox" | "tabs"

export interface GenericInput extends InputBase {
  readonly kind: "generic"
}
export interface DropDownInput extends InputBase {
  readonly kind: "dropdown"
  //readonly def: string | number
  readonly options: readonly InputOption[]
  readonly preferredStyle: DropDownStyle
  readonly groups: readonly DropdownGroup[]
}

export interface DropdownGroup {
  readonly label?: string | null
  readonly startAt: InputSchemaValue
}

export interface DirectoryInput extends InputBase {
  readonly kind: "directory"
  readonly hideLabel: boolean
}
export interface TextInput extends InputBase {
  readonly kind: "text"
  readonly multiline?: boolean
  readonly minLength?: number | null
  readonly maxLength?: number | null
  readonly placeholder?: string | null
  readonly def?: string | null
  readonly allowEmptyString?: boolean
  readonly hideLabel: boolean
}
export interface NumberInput extends InputBase {
  readonly kind: "number"
  readonly def: number
  readonly min?: number | null
  readonly max?: number | null
  readonly precision: number
  readonly controlsStep: number
  readonly unit?: string | null
  readonly noteExpression?: string | null
  readonly hideTrailingZeros: boolean
  readonly hideLabel: boolean
}
export interface SliderInput extends InputBase {
  readonly kind: "slider"
  readonly def: number
  readonly min: number
  readonly max: number
  readonly precision: number
  readonly controlsStep: number
  readonly unit?: string | null
  readonly noteExpression?: string | null
  readonly hideTrailingZeros: boolean
  readonly ends: readonly [string | null, string | null]
  readonly sliderStep: number
  readonly gradient?: readonly string[] | null
  readonly scale: "linear" | "log" | "log-offset" | "sqrt"
}
export interface ColorInput extends InputBase {
  readonly kind: "color"
  readonly def: string
  readonly channels?: readonly number[] | null
}
export type InputKind = Input["kind"]

export type Input =
  | GenericInput
  | DirectoryInput
  | TextInput
  | DropDownInput
  | SliderInput
  | NumberInput
  | ColorInput

export interface Output {
  readonly id: OutputId
  readonly type: ExpressionJson
  readonly neverReason?: string | null
  readonly label: string
  readonly kind: OutputKind
  readonly description?: string | null
}
export type OutputKind = "value" | "dict" | "image"

export interface BackendJsonEdgeInput {
  type: "edge"
  id: string
}
export interface BackendJsonValueInput {
  type: "value"
  value: InputValue | null
}
export type BackendJsonInput = BackendJsonEdgeInput | BackendJsonValueInput
export interface BackendJsonNode {
  id: string
  schemaId: SchemaId
  inputs: BackendJsonInput[]
  nodeType: string
  connectedTo: {
    inputs: string[] // IDs de los nodos de los cuales este nodo recibe datos
    outputs: string[] // IDs de los nodos a los que este nodo envía datos
  }
}
