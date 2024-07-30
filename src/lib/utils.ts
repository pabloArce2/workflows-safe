import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getMousePosition = (canvas: HTMLCanvasElement, evt: React.WheelEvent) => {
  const rect = canvas.getBoundingClientRect()
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top,
  }
}
export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function sortObjectFollowingArrayOrder(array: string[], object: any) {
  const orderedObject: any = {}
  array.forEach((key) => {
    if (object.hasOwnProperty(key)) {
      orderedObject[key] = object[key]
    }
  })
  return orderedObject
}

export function removeSpecialCharactersAndSpaces(imageName: string) {
  let parts = imageName.split(".")
  let namePart = parts.slice(0, -1).join(".")
  let extensionPart = parts.slice(-1)[0]
  // Reemplazar todos los caracteres no deseados en el nombre del archivo
  namePart = namePart.replace(/[^a-zA-Z0-9]/g, "_")
  // Eliminar guiones bajos repetidos y guiones bajos al final
  namePart = namePart.replace(/_+/g, "_").replace(/_+$/, "")
  // Reconstruir el nombre del archivo con su extensión
  return `${namePart}.${extensionPart}`.toLocaleLowerCase()
}

export function buildFilteredUrl(filterState: any) {
  const urlParams = new URLSearchParams() // Crear un objeto URLSearchParams para los parámetros de la URL
  // Iterar sobre las propiedades del objeto filterState
  for (const property in filterState) {
    if (Array.isArray(filterState[property])) {
      // Verificar que la propiedad sea un array
      if (filterState[property].length > 0) {
        // Agregar los valores del array a la URL como parámetros
        filterState[property].forEach((value) => {
          urlParams.append(`${property}`, value)
        })
      }
    } else {
      if (filterState[property]) urlParams.append(`${property}`, filterState[property])
    }
  }
  // Obtener la URL completa con los parámetros de filtrado
  const filteredUrl = urlParams.toString()

  return filteredUrl
}
