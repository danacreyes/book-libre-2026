import { useState } from "react"
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react"
import { StarIcon, XMarkIcon } from "@heroicons/react/24/solid"
import type { BookReview } from "@/domain/review"
import { showToast } from "@/utils/toast"
import { ReviewItem } from "./ReviewItem"
import { bookService } from "@/services/bookService"

type ReviewsModalProps = {
  bookId: string
  bookTitle?: string
  initialReviews?: BookReview[]
}

export function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          className={`size-3.5 ${star <= rating ? "text-amber-400" : "text-gray-300"}`}
        />
      ))}
    </div>
  )
}

export default function ReviewsModal({
  bookId,
  bookTitle,
  initialReviews = [],
}: ReviewsModalProps) {
  const [open, setOpen] = useState(false)
  const [reviews, setReviews] = useState<BookReview[]>([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)


  const loadReviews = async (pageToLoad: number) => {
    try {
      const response = await bookService.getReviews(bookId, pageToLoad, 4)
      // console.log('Respuesta del back:', response.data)
      setReviews((prev) => [...prev, ...response.data])
      // esto hace que no me deje seguir haciendo llamadas al back si la última respuesta no trajo 2 reseñas, es decir, si ya no hay más
      setHasMore(response.data.length === 4)
    } catch (error) {
      showToast.httpError(error, "Error al cargar libro")
    }
  }

  const handleOpen = async () => {
    setOpen(true)
    setReviews(initialReviews)
    if (initialReviews.length < 4) {
      setHasMore(false)
    } else {
      const response = await bookService.getReviews(bookId, 1, 4)
      // console.log('Respuesta del back:', response.data)
      setHasMore(response.data.length > 0)
    }
  }

  const handleClose = () => {
    setOpen(false)
    setTimeout(() => {
      setReviews([])
      setPage(0)
      setHasMore(true)
    }, 300)
  }

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    loadReviews(nextPage)
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className="rounded-md bg-gray-950/5 px-2.5 py-1.5 text-sm font-semibold text-gray-900 hover:bg-gray-950/10"
      >
        Ver todas las reseñas →
      </button>

      <Dialog open={open} onClose={handleClose} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-2xl data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 pt-5 pb-4">
                <div>
                  <DialogTitle
                    as="h3"
                    className="text-base font-semibold text-gray-900"
                  >
                    Reseñas
                  </DialogTitle>
                  {bookTitle && (
                    <p className="mt-0.5 text-sm text-gray-500">{bookTitle}</p>
                  )}
                </div>
                <button
                  onClick={handleClose}
                  className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                >
                  <XMarkIcon className="size-5" />
                </button>
              </div>

              {/* Reviews list */}
              <div className="max-h-[60vh] space-y-4 overflow-y-auto bg-white px-6 py-4">
                {reviews.length === 0 ? (
                  <p className="py-8 text-center text-gray-500">
                    Este libro todavía no tiene reseñas.
                  </p>
                ) : (
                  reviews.map((review, i) => (
                    <ReviewItem key={`${review.id}-${i}`} review={review} i={i} />
                  ))
                )}

                {hasMore && (
                  <button
                    onClick={loadMore}
                    className="w-full rounded-lg border border-gray-200 bg-gray-950/5 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-950/10"
                  >
                    Ver más reseñas ↓
                  </button>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-3">
                <span className="text-xs text-gray-600">
                  Mostrando {reviews.length} reseñas
                </span>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  )
}
