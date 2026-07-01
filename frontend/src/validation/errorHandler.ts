export const getErrorMessage = (error: any): string => {
  if (error.response && error.response.data) {
    const responseData = error.response.data
    const status = error.response.status

    if (typeof responseData === "object" && responseData !== null) {
      if (status >= 500) {
        return "Ocurrió un error, consulte al administrador del sistema."
      }
      if (responseData.detalle) {
        return responseData.detalle
      }
      if (responseData.detail) {
        return responseData.detail
      }
      if (responseData.message) {
        return responseData.message
      }
    }

    if (typeof responseData === "string") {
      return responseData
    }
  } else if (error.code === "ERR_NETWORK") {
    return "Ocurrió un problema de conexión con el servidor. Intente nuevamente más tarde"
  } else if (error.message) {
    return error.message
  }
  return "Error desconocido"
}