export const formatDate = (input: string | Date) => {
  if (!input) return ""
  const str = input instanceof Date ? input.toISOString().split("T")[0] : input
  const d = new Date(str + "T00:00:00")
  const day = d.getDate().toString().padStart(2, "0")
  const month = d.toLocaleString("en-US", { month: "short" })
  const year = d.getFullYear()
  return `${day} ${month}, ${year}`
}

// Convierte una fecha ISO-8601 en un texto relativo ("hace 5 min", "hace 2 h", "hace 3 d").
export function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const min = Math.floor(diffMs / 60000)
  if (min < 1) return "recién"
  if (min < 60) return `hace ${min} min`
  const h = Math.floor(min / 60)
  if (h < 24) return `hace ${h} h`
  const d = Math.floor(h / 24)
  return `hace ${d} d`
}
