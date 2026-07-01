export const BookCondition = {
  EXCELLENT: "EXCELENTE",
  VERY_GOOD: "MUY BUENO",
  GOOD: "BUENO",
  BAD: "MALO",
  REGULAR: "REGULAR",
}

export const BookConditionStyle: Record<BookCondition, string> = {
  [BookCondition.EXCELLENT]: "bg-purple-100 text-purple-700",
  [BookCondition.VERY_GOOD]: "bg-green-100 text-green-700",
  [BookCondition.GOOD]: "bg-yellow-100 text-yellow-700",
  [BookCondition.BAD]: "bg-red-100 text-red-700",
  [BookCondition.REGULAR]: "bg-gray-100 text-gray-700",
}

export type BookCondition = (typeof BookCondition)[keyof typeof BookCondition]
