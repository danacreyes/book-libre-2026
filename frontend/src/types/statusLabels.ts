// Record<tipoDeClave, tipoDeValor>
export const borrowerStatusStyles: Record<string, string> = {
  ACTIVE: "bg-blue-500 text-white",
  RESERVED: "bg-green-500 text-white",
  SOON_TO_END: "bg-orange-400 text-white",
  RETURNED: "bg-red-400 text-white",
}

export const borrowerStatusLabels: Record<string, string> = {
  ACTIVE: "Activo",
  RESERVED: "Reservado",
  SOON_TO_END: "Próximo a vencer",
  RETURNED: "Devuelto",
}

export const ownerStatusStyles: Record<string, string> = {
  BORROWED: "bg-orange-400 text-white",
  AVAILABLE: "bg-green-500 text-white",
}

export const ownerStatusLabels: Record<string, string> = {
  BORROWED: "Prestado",
  AVAILABLE: "Disponible",
}
