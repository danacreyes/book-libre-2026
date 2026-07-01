import { type ReactNode } from "react"
import { DotIcon } from "@phosphor-icons/react"

export default function Tag({ text, buttonOnClickFunction, filterKind, filter, disabled, disabledCondition}: { text: ReactNode, buttonOnClickFunction?: () => void, filterKind: string, filter: string, disabled?: boolean, disabledCondition?: string}) {
  const identifier = text == "Todos" || text == "Disponibles" || text == "Prestados"
  
  const filterColor = 
    filter == filterKind
      ? "bg-black text-white"
      : "bg-gray-100 text-gray-800 hover:bg-gray-200"

  return (
    <button
      key={filterKind}
      disabled={disabled}
      className={`rounded-full flex items-center p-2 pr-3 pl-3 text-xs font-bold ${filterColor} ${disabledCondition}`}
      onClick={buttonOnClickFunction}
    >
      {identifier || <DotIcon size={24} />}
      {text}
    </button>
  )
}
