import { useState } from "react"
import { IconStar, IconX } from "@tabler/icons-react"
import { reserveService } from "@/services/reserveService"
import { showToast } from "@/utils/toast"
import { TextareaField } from "./Textarea"

interface RatingModalProps {
  reservationId: number
  bookTitle: string
  onClose: () => void
  onSuccess: () => void
}

export default function RatingModal({
  reservationId,
  bookTitle,
  onClose,
  onSuccess,
}: RatingModalProps) {
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [review, setReview] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (rating === 0) {
      showToast.error("Seleccioná al menos una estrella")
      return
    }
    setLoading(true)
    try {
      await reserveService.rateLoan(reservationId, { rate: rating, review })
      showToast.success("¡Calificación enviada!")
      onSuccess() //? esto creo que esta de mas
      onClose()
    } catch (error) {
      showToast.httpError(error, "Error al calificar")
    } finally {
      setLoading(false)
    }
  }

  return (
    // =================== Backdrop ===================
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* =================== Modal =================== */}
      <div
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* =================== Close =================== */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:cursor-pointer hover:text-gray-600"
        >
          <IconX size={20} />
        </button>

        {/* =================== Header =================== */}
        <div className="mb-1 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50">
            <IconStar size={18} className="text-blue-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-800">
            Calificar préstamo
          </h2>
        </div>
        <p className="mb-5 text-sm text-gray-500">
          Contanos tu experiencia con{" "}
          <span className="font-semibold text-gray-700">{bookTitle}</span>
        </p>

        {/* =================== Stars =================== */}
        <div className="mb-4 flex justify-center">
          {[1, 2, 3, 4, 5].map((star) => (
            // hago star un numero asi puedo hacer la cosa esta
            <button
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              className="px-2 transition-transform hover:scale-115 hover:cursor-pointer"
            >
              <IconStar
                size={36}
                fill={(hovered || rating) >= star ? "currentColor" : "none"}
                className={
                  (hovered || rating) >= star
                    ? "text-yellow-400"
                    : "text-gray-300"
                }
              />
            </button>
          ))}
        </div>
        <p className="mb-4 text-center text-xs text-gray-400">
          {rating === 0 && "Seleccioná una puntuación"}
          {rating === 1 && "Muy malo"}
          {rating === 2 && "Malo"}
          {rating === 3 && "Regular"}
          {rating === 4 && "Bueno"}
          {rating === 5 && "¡Excelente!"}
        </p>

        {/* =================== review =================== */}
        {/* <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Dejá un comentario (opcional)..."
          rows={3}
          className="w-full resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        /> */}
        <TextareaField 
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Dejá un comentario (opcional)..."
        rows={3}
        className="w-full resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        label="" 
        maxLength={250} 
        id="review-textarea" 
        type="text" 
        />

        {/* =================== Actions =================== */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-500 transition hover:cursor-pointer hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 rounded-xl bg-blue-500 py-2.5 text-sm font-semibold text-white transition hover:cursor-pointer hover:bg-blue-600 disabled:opacity-60"
          >
            {loading ? "Enviando..." : "Enviar calificación"}
          </button>
        </div>
      </div>
    </div>
  )
}
