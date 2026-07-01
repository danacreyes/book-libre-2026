import { useState } from "react"
import { IconUser, IconCalendar, IconBook, IconStar } from "@tabler/icons-react"
import type { ReservationDTO } from "@/types/reservationType"
import RatingModal from "./RatingModal"
import {
  borrowerStatusStyles,
  borrowerStatusLabels,
} from "@/types/statusLabels"

interface BookCardProps {
  book: ReservationDTO
  activeTab: string
  onRated: () => void // para recargar la lista tras calificar
}

export default function BookCard({ book, activeTab, onRated }: BookCardProps) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <div className="group relative flex flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.03] hover:shadow-xl hover:shadow-gray-300/60">
        {/* =================== Status badge =================== */}
        <span
          className={`absolute top-1 right-2 z-10 rounded-full px-2 py-0.5 text-xs font-semibold ${borrowerStatusStyles[book.state]}`}
        >
          {borrowerStatusLabels[book.state] ?? book.state}
        </span>

        {/* =================== Cover =================== */}
        <img
          src={book.bookCover}
          alt={book.bookTitle}
          className="h-68 object-cover transition duration-300 group-hover:scale-103"
        />

        {/* =================== Info =================== */}
        <div className="flex flex-col gap-2 p-3">
          <div className="flex items-start justify-between gap-1">
            {/* <p className="text-sm leading-tight font-bold text-gray-800"> */}
            <p className="overflow-hidden text-sm leading-tight font-bold text-ellipsis whitespace-nowrap text-gray-800">
              {book.bookTitle}
            </p>
            <span className="flex items-center gap-1 text-xs font-bold whitespace-nowrap text-gray-500">
              <IconStar
                size={12}
                fill="currentColor"
                className="text-yellow-500"
              />
              {book.rating}
            </span>
          </div>
          <p className="text-xs font-bold text-gray-400">{book.bookAuthor}</p>

          <div className="border-b border-gray-100" />

          <div className="mt-1 space-y-1 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <IconUser size={14} />
              {activeTab == "prestados-a-mi" ? (
                <>
                  <p className="">Prestado por:</p>
                  <span className="max-w-31 overflow-hidden font-medium text-ellipsis whitespace-nowrap text-gray-700">
                    {book.loanedBy}
                  </span>
                </>
              ) : (
                <>
                  <p className="">Prestado a:</p>
                  <span className="max-w-31 overflow-hidden font-medium text-ellipsis whitespace-nowrap text-gray-700">
                    {book.loanedTo}
                  </span>
                </>
              )}
            </div>
            <p className="flex items-center gap-1">
              <IconCalendar size={14} />
              Rango:
              <span className="font-medium text-gray-700">
                {book.pickUpDate} - {book.dropOffDate}
              </span>
            </p>
            <div className="flex items-center gap-1">
              <IconBook size={14} className="text-blue-400" />
              <p className="font-semibold text-blue-400">BIBLOKARMA</p>
              <p className="font-semibold text-gray-700">
                +{book.bibliokarmas}
              </p>
            </div>
          </div>

          {/* fijate cuales son los parametros para poder hacer review al libro */}
          {book.canRate && (
            <button
              onClick={() => setShowModal(true)}
              className="mt-2 flex w-full items-center justify-center gap-1 rounded-lg border border-blue-50 bg-blue-100 py-1.5 text-xs font-semibold text-blue-500 transition-colors hover:cursor-pointer hover:bg-blue-200"
            >
              <IconStar size={12} />
              Calificar
            </button>
          )}
        </div>
      </div>

      {showModal && (
        <RatingModal
          reservationId={book.id}
          bookTitle={book.bookTitle}
          onClose={() => setShowModal(false)}
          onSuccess={onRated}
        />
      )}
    </>
  )
}
