import { DotIcon, PencilIcon, TrashIcon } from "@phosphor-icons/react"
import { useNavigate } from "react-router"
import { formatDate } from "@/utils/formatDate"
import { formatClicks } from "@/utils/formatClicks"
import { bookService } from "@/services/bookService"
import { showToast } from "@/utils/toast"
import { ownerStatusStyles, ownerStatusLabels } from "@/types/statusLabels"

export default function ProfileBook({
  bookImg,
  bookName,
  bookAuthor,
  bookGender,
  bookState,
  timestamp,
  bookId,
  clicks,
  onDelete,
}: {
  bookImg: string
  bookName: string
  bookAuthor: string
  bookGender: string
  bookState: string
  timestamp: Date
  bookId: String
  clicks: number
  onDelete: () => void
}) {
  const navigate = useNavigate()

  const handleDelete = async () => {
    if (bookState === "PRESTADO") {
      showToast.error("No es posible eliminar un libro que esta prestado")
    } else {
      try {
        await bookService.deleteBook(String(bookId))
        showToast.success("Libro eliminado con éxito")
        onDelete()
      } catch (error: any) {
        const data = error.response?.data
        const message = data?.detail || "No se pudo eliminar el libro"
        showToast.error(message)
      }
    }
  }

  return (
    <div className="flex h-25 items-center gap-4 pr-2 pl-2">
      <img src={bookImg} alt="" className="h-23 w-15 rounded-lg" />
      <div className="min-w-0 flex-1">
        <p className="truncate">{bookName}</p>
        <p className="truncate text-sm text-gray-400">{bookAuthor}</p>
        <p className="truncate text-sm text-gray-400">{bookGender}</p>
      </div>
      <div className="flex w-24 items-center justify-center text-sm text-gray-400">
        {formatClicks(clicks)}
      </div>
      <div className="w-28">
        <span
          className={`flex rounded-full pr-1 font-semibold ${ownerStatusStyles[bookState]}`}
        >
          {<DotIcon size={20} />}
          {ownerStatusLabels[bookState] ?? bookState}
        </span>
      </div>
      <div className="w-24 text-sm text-gray-400">{formatDate(timestamp)}</div>
      <div className="w-16">
        <button className="text-gray-500 hover:cursor-pointer hover:text-gray-900">
          <PencilIcon
            size={24}
            onClick={() => navigate(`/editar-libro/${bookId}`)}
          />
        </button>
        <button className="text-gray-500 hover:cursor-pointer hover:text-red-500">
          <TrashIcon size={24} onClick={() => handleDelete()} />
        </button>
      </div>
    </div>
  )
}
