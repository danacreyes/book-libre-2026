export const formatDate = (input: string | Date) => {
  if (!input) return ""
  const str = input instanceof Date 
    ? input.toISOString().split('T')[0] 
    : input
  const d = new Date(str + "T00:00:00")
  const day = d.getDate().toString().padStart(2, "0")
  const month = d.toLocaleString("en-US", { month: "short" })
  const year = d.getFullYear()
  return `${day} ${month}, ${year}`
}