import { camelToSnake, snakeToCamel } from "./string"

export function transformKeysToCamelCase<U = any>(
  obj: any,
  transformers?: Record<string, (value: any) => any>
): U {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    const transformedValue = transformers?.[key]
      ? transformers[key](value)
      : value
    return {
      ...acc,
      [snakeToCamel(key)]: transformedValue,
    }
  }, {}) as U
}

export function transformKeysToSnakeCase<U = any>(
  obj: any,
  transformers?: Record<string, (value: any) => any>
): U {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    const transformedValue = transformers?.[key]
      ? transformers[key](value)
      : value
    return {
      ...acc,
      [camelToSnake(key)]: transformedValue,
    }
  }, {}) as U
}
