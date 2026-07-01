import { Link, useParams, useSearchParams } from "react-router"
import { bookService } from "@/services/bookService"
import { useOnInit } from "@/hooks/UseOnInit"
import { useState } from "react"
import type { Book } from "@/domain/book"
import { ReservationCard } from "@/components/ReservationCard"
import { reserveService } from "@/services/reserveService"
import { BookReview } from "@/domain/review"
import { showToast } from "@/utils/toast"
import ReviewsModal from "@/components/ReviewsModal"
import { StarRating } from "@/components/ReviewsModal"
import { formatDate } from "@/utils/formatDate"
import type { ReservationDates } from "@/types/reservationDates"
import { ReviewItem } from "@/components/ReviewItem"

export default function BookDetail() {
  const { id } = useParams()
  const [book, setBook] = useState<Book>()
  const [reviews, setReviews] = useState<BookReview[]>([])
  const [loading, setLoading] = useState(true)
  const [reservedDates, setReservedDates] = useState<ReservationDates[]>([])
  const [bibliokarmas, setBibliokarmas] = useState(0)
  const [searchParams] = useSearchParams()

  const getReservedDates = async () => {
    const res = await reserveService.getReservedDates(id!)
    setReservedDates(res.data)
  }

  const getBook = async () => {
    try {
      const bookResponse = await bookService.getBookDetail(id!)
      setBook(bookResponse)
    } catch (error) {
      showToast.httpError(error, "Error al cargar libro")
    } finally {
      setLoading(false)
    }
  }

  const getBookReviews = async () => {
    try {
      const response = await bookService.getReviews(id!, 0, 4)
      setReviews(response.data)
      // console.log('Reseñas cargadas:', response.data)
    } catch (error) {
      showToast.httpError(error, "Error al cargar reseñas")
    }
  }

  useOnInit(() => {
    getBook()
    getBookReviews()
    getReservedDates()
    // console.log(searchParams)
    // console.log(location.state?.search)
  })

  if (loading) return <div>Cargando...</div>
  if (!book) return <div>Libro no encontrado</div>

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ================ Breadcrumb ================ */}
      <div className="px-6 py-5 pl-40">
        <ol className="flex items-center gap-1 text-sm text-gray-500">
          <li>
            <Link
              to={{
                pathname: `/`,
                search: searchParams.toString()
              }}
              className="hover:text-gray-700">
              Explorar
            </Link>
          </li>
          <li>
            <svg
              className="mx-1 inline h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m9 18 6-6-6-6"
              />
            </svg>
          </li>
          <li className="font-medium text-gray-700">{book!.title}</li>
        </ol>
      </div>

      {/* ================ Top Section ================ */}
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-2">
        <div className="flex items-start gap-6">
          <div className="flex h-120 w-80 shrink-0 flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <img
              src={book!.imageSrc}
              alt={book!.title}
              className="h-full w-full rounded-xl object-cover shadow-md"
            />
          </div>

          {/* ================ Book Info ================ */}
          <div className="flex flex-1 flex-col">
            <div className="mb-3 flex items-center gap-3">
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold tracking-wide text-blue-600 uppercase">
                {book!.bookType}
              </span>
              <div className="flex items-center gap-1.5">
                <StarRating rating={BookReview.averageRating(reviews)} />
                <span className="text-xs text-gray-500">{`(${book.rating.toFixed(1)})`}</span>
              </div>
            </div>

            <h1 className="mb-2 text-4xl font-bold text-gray-900">
              {book!.title}
            </h1>

            <div className="mb-5 flex items-center gap-2">
              <span className="text-xs tracking-wide text-gray-400 uppercase">
                Autor
              </span>
              <img
                src={`${import.meta.env.VITE_API_URL}/${book!.author.avatar}`}
                alt={book!.author.name}
                className="h-7 w-7 rounded-full object-cover"
              />
              <span className="text-sm font-semibold text-gray-700">
                {book!.author.name}
              </span>
            </div>

            <h2 className="mb-2 text-base font-bold text-gray-900">Sinopsis</h2>
            {book!.desc}
          </div>
        </div>

        {/* ================ Reservation ================ */}
        <div className="flex items-start gap-6">
          <ReservationCard
            book={book}
            reservedDates={reservedDates}
            initialPickUpDate={searchParams.get("pickUpDate") ?? undefined}
            initialDropOffDate={searchParams.get("dropOffDate") ?? undefined}
            onBibliokarmasChange={setBibliokarmas}
          />

          <div className="flex flex-1 flex-col gap-4">
            <div className="gap-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-l border-b border-gray-100 font-bold text-gray-900">
                Detalles del Libro
              </h2>
              <div className="grid grid-cols-6 gap-4 py-2">
                <div className="col-start-1 col-end-3">
                  <p className="text-xs text-[#A3B0C2] uppercase">Tipo</p>
                  <span className="inline-flex items-center gap-1 rounded bg-[#FFFBEB] px-2 py-0.5 text-base font-medium text-[#C77F44]">
                    {book!.bookType}
                  </span>
                </div>
                <div className="col-span-2 col-end-7 text-center">
                  <p className="text-xs text-[#A3B0C2] uppercase">
                    Bibliokarmas
                  </p>
                  <span className="inline-block rounded bg-green-100 px-3 py-0.5 text-base text-green-700">
                    + {bibliokarmas}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-x-6 gap-y-3 py-2">
                <div className="pr-[<3>]">
                  <p className="text-xs text-[#A3B0C2] uppercase">Género</p>
                  <p className="text-base text-gray-800 lowercase">
                    {book!.gender}
                  </p>
                </div>
                <div className="pr-[<3>]">
                  <p className="text-xs text-[#A3B0C2] uppercase">Páginas</p>
                  <p className="text-base text-gray-800">{book!.numPages}</p>
                </div>
                <div className="pr-[<3>]">
                  <p className="text-xs text-[#A3B0C2] uppercase">Idioma</p>
                  <p className="text-base text-gray-800">{book!.language}</p>
                </div>
                <div className="pr-[<3>]">
                  <p className="text-xs text-[#A3B0C2] uppercase">Editorial</p>
                  <p className="text-base text-gray-800">{book!.editorial}</p>
                </div>
                <div className="pr-[<3>]">
                  <p className="text-xs text-[#A3B0C2] uppercase">ISBN-13</p>
                  <p className="text-base text-gray-800">{book!.isbn}</p>
                </div>
                <div className="pr-[<3>]">
                  <p className="text-xs text-[#A3B0C2] uppercase">Publicado</p>
                  <p className="text-base text-gray-800">
                    {formatDate(book!.publishDate)}
                  </p>
                </div>
                <div className="pr-[3]">
                  <p className="text-xs text-[#A3B0C2] uppercase">Estado</p>
                  <p className="text-base text-green-600">{book!.condition}</p>
                </div>
                <div>
                  <p className="text-xs text-[#A3B0C2] uppercase">Rating</p>
                  <p className="text-base text-gray-800">{`${book.rating.toFixed(1)}`}</p>
                </div>
              </div>
            </div>

            {/* ================ Community Reviews ================ */}
            <div className="mt-2 gap-2 p-2">
              <div className="flex items-center justify-between">
                <h2 className="text-l border-b border-gray-100 font-bold text-gray-900">
                  Reseñas de la Comunidad
                </h2>
                {reviews.length === 0 ? (
                  <p className="py-8 text-center text-gray-500">
                    Este libro todavía no tiene reseñas.
                  </p>
                ) : (
                  reviews.length >= 2 && (
                    <ReviewsModal
                      bookId={book.id!}
                      bookTitle={book.title}
                      initialReviews={reviews}
                    />
                  )
                )}
              </div>

              {/* First two reviews */}
              <div className="mt-3 grid grid-cols-2 gap-4">
                  {reviews.slice(0, 2).map((review, i) => (
                    <ReviewItem key={`${review.id}-${i}`} review={review} i={i} />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
