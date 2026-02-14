export function snakeToCamel(string: string) {
  return string.replace(/([-_][a-z])/g, (group) =>
    group.toUpperCase().replace("-", "").replace("_", "")
  )
}

export function camelToSnake(string: string) {
  return string.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase()
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function isNumberString(string: string) {
  return /^\d+$/.test(string)
}
