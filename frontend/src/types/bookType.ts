export const BookType = {
  Common: "COMUN",
  WithADedication: "CON DEDICATORIA", 
  Collectible: "COLECCIONABLE",
}

export const BookTypeLabels: Record<BookType, string> = {
  [BookType.Common]: "Común",
  [BookType.WithADedication]: "Con Dedicatoria",
  [BookType.Collectible]: "Coleccionable",
}

export const BookTypeStyle: Record<BookType, string> = {
  [BookType.Common]: "bg-gray-50 text-gray-700",
  [BookType.WithADedication]: "bg-orange-50 text-orange-700",
  [BookType.Collectible]: "bg-blue-50 text-blue-700",
}

export type BookType = (typeof BookType)[keyof typeof BookType]
