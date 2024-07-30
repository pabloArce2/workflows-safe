export type NumberJson = number | "inf" | "-inf" | "NaN"

export type ExpressionJson =
  | boolean
  | string
  | number
  | TypeJson
  | ExpressionJson[]
  | UnionExpressionJson
  | IntersectionExpressionJson
  | NamedExpressionJson
  | FieldAccessExpressionJson
  | FunctionCallExpressionJson
  | MatchExpressionJson

export type TypeJson = PrimitiveTypeJson | "never" | "any"
export type PrimitiveTypeJson = NumberPrimitiveJson | StringPrimitiveJson
export type NumberPrimitiveJson = "number" | NumericLiteralTypeJson | IntervalTypeJson | IntIntervalTypeJson
export type StringPrimitiveJson = "string" | StringLiteralTypeJson

export interface NumericLiteralTypeJson {
  type: "numeric-literal"
  value: NumberJson
}
export interface IntervalTypeJson {
  type: "interval"
  min: NumberJson
  max: NumberJson
}
export interface IntIntervalTypeJson {
  type: "int-interval"
  min: NumberJson
  max: NumberJson
}
export interface StringLiteralTypeJson {
  type: "string-literal"
  value: string
}

export interface UnionExpressionJson {
  type: "union"
  items: ExpressionJson[]
}
export interface IntersectionExpressionJson {
  type: "intersection"
  items: ExpressionJson[]
}
export interface NamedExpressionJson {
  type: "named"
  name: string
  fields?: Record<string, ExpressionJson> | null
}
export interface FieldAccessExpressionJson {
  type: "field-access"
  field: string
  of: ExpressionJson
}
export interface FunctionCallExpressionJson {
  type: "function-call"
  name: string
  args: ExpressionJson[]
}
export interface MatchArmJson {
  pattern: ExpressionJson
  binding?: string | null
  to: ExpressionJson
}
export interface MatchExpressionJson {
  type: "match"
  of: ExpressionJson
  arms: MatchArmJson[]
}
