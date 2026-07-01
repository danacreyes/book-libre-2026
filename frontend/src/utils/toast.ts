import { HttpStatusCode } from "axios"
import { toast } from "react-toastify"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getErrorMessage = (error: any): string => {
  if (error?.response?.data) {
    const { data, status } = error.response

    if (typeof data === "object" && data !== null) {
      if (data.detail) return data.detail
      if (data.message && status < 500) return data.message
      if (status >= 500) return "Ocurrió un error, consulte al administrador."
    }

    if (typeof data === "string" && status < 500) return data
  }

  if (error?.code === "ERR_NETWORK")
    return "Problema de conexión con el servidor. Intente más tarde."

  if (error.response?.status == HttpStatusCode.Forbidden)
    return "No tenés autorización para realizar esta acción"

  return error?.message ?? "Error desconocido"
}

const showUnique = (fn: (msg: string, options: object) => void, msg: string, autoClose?: number) => {
  const id = msg
  if (!toast.isActive(id)) fn(msg, { toastId: id, autoClose })
}

export const showToast = {
  success: (msg: string, autoClose?: number) => showUnique(toast.success.bind(toast), msg, autoClose),
  warning: (msg: string, autoClose?: number) => showUnique(toast.warning.bind(toast), msg, autoClose),
  error: (msg: string, autoClose?: number) => showUnique(toast.error.bind(toast), msg, autoClose),
  httpError: (error: unknown, prefix?: string, autoClose?: number) => {
    const msg = getErrorMessage(error)
    const full = prefix ? `${prefix}: ${msg}` : msg
    showUnique(toast.error.bind(toast), full, autoClose)
  },
}