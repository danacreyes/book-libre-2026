import { useState } from "react"
import type { Book } from "@/domain/book"
import { reserveService } from "@/services/reserveService"
import { showToast } from "@/utils/toast"
import { formatDate } from "@/utils/formatDate"
import type { ReservationDates } from "@/types/reservationDates"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { useNavigate } from "react-router"
import { useOnInit } from "@/hooks/UseOnInit"
import { getId } from "@/context/AuthContext"
import { useUserProfile } from "@/context/UserProfileContext"

type Props = {
  book: Book
  initialPickUpDate?: string
  initialDropOffDate?: string
  reservedDates: ReservationDates[]
  onBibliokarmasChange: (value: number) => void
}

export function ReservationCard({
  book,
  initialPickUpDate,
  initialDropOffDate,
  reservedDates,
  onBibliokarmasChange,
}: Props) {
  const [pickUpDate, setPickUpDate] = useState(initialPickUpDate ?? "")
  const [dropOffDate, setDropOffDate] = useState(initialDropOffDate ?? "")
  const [showPicker, setShowPicker] = useState(false)
  const { refreshProfile } = useUserProfile()
  // const [bibliokarmas, setBibliokarmas] = useState(book.bookBibliokarmas)

  const navigate = useNavigate()
  // const today = new Date().toISOString().split('T')[0]

  const calculateDays = () => {
    if (!pickUpDate || !dropOffDate) return 0
    const from = new Date(pickUpDate + "T00:00:00")
    const to = new Date(dropOffDate + "T00:00:00")
    return (
      Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1
    )
  }

  const handleConfirmReservation = async () => {
    try {
      await reserveService.createReservation(book.id!, pickUpDate, dropOffDate)
      await refreshProfile()
      showToast.success(
        "Reserva confirmada! Seras redireccionado a la página principal", 1000 
      )
      setTimeout(() => navigate("/"), 1500)
    } catch (error) {
      showToast.httpError(error, "Error al reservar")
      // window.location.reload()
    }
  }

  const recalculateBibliokarmas = async (pickup: string, dropoff: string) => {
    const userId = getId()
    const res = await reserveService.getBibliokarmas(
      book.id!,
      userId!,
      pickup,
      dropoff,
    )
    onBibliokarmasChange(res.data)
  }

  const isDateInReservedPeriod = (date: string): boolean =>
    reservedDates.some(
      (period) => date >= period.pickUpDate && date <= period.dropOffDate,
    )

  const isReserved = (date: Date): boolean =>
    isDateInReservedPeriod(date.toISOString().split("T")[0])

  const isDateReserved = (date: string): boolean => {
    const reserved = isDateInReservedPeriod(date)
    if (reserved) {
      showToast.error("La fecha seleccionada no está disponible")
    }
    return reserved
  }

  const handleDropOffChange = (date: Date | null) => {
    if (!date || !pickUpDate) return

    const selected = toLocalDateString(date)

    const final = selected < pickUpDate ? pickUpDate : selected

    setDropOffDate(final)
    recalculateBibliokarmas(pickUpDate, final)
  }

  useOnInit(() => {
    if (pickUpDate && dropOffDate) {
      recalculateBibliokarmas(pickUpDate, dropOffDate)
    }
  })

  const toLocalDateString = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const handlePickUpChange = (date: Date | null) => {
    if (!date) return

    const newPickUp = toLocalDateString(date)
    setPickUpDate(newPickUp)

    // Solo piso la fecha de fin si la nueva fecha de inicio la pasa
    const effectiveDropOff =
      dropOffDate && newPickUp <= dropOffDate ? dropOffDate : newPickUp
    setDropOffDate(effectiveDropOff)

    recalculateBibliokarmas(newPickUp, effectiveDropOff)
  }

  return (
    <div className="flex w-80 shrink-0 flex-col gap-2 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      {/* ===== Header ===== */}
      <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
        <span className="text-[#FF8A80]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M11.5 21h-5.5a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v6" />
            <path d="M16 3v4" />
            <path d="M8 3v4" />
            <path d="M4 11h16" />
            <path d="M15 19l2 2l4 -4" />
          </svg>
        </span>
        Tu Reserva
      </div>

      {/* ===== Date Picker ===== */}
      <div>
        <p className="mb-1 text-xs tracking-wide text-gray-400 uppercase">
          Fechas Seleccionadas:
        </p>
        <div className="relative">
          <div
            onClick={() => setShowPicker(!showPicker)}
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-[#F8FAFC] px-3 py-2 text-sm text-gray-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="icon icon-tabler icons-tabler-filled icon-tabler-calendar-week text-[#FF8A80]"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M16 2c.183 0 .355 .05 .502 .135l.033 .02c.28 .177 .465 .49 .465 .845v1h1a3 3 0 0 1 2.995 2.824l.005 .176v12a3 3 0 0 1 -2.824 2.995l-.176 .005h-12a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-12a3 3 0 0 1 2.824 -2.995l.176 -.005h1v-1a1 1 0 0 1 .514 -.874l.093 -.046l.066 -.025l.1 -.029l.107 -.019l.12 -.007q .083 0 .161 .013l.122 .029l.04 .012l.06 .023c.328 .135 .568 .44 .61 .806l.007 .117v1h6v-1a1 1 0 0 1 1 -1m3 7h-14v9.625c0 .705 .386 1.286 .883 1.366l.117 .009h12c.513 0 .936 -.53 .993 -1.215l.007 -.16z" />
              <path d="M9.015 13a1 1 0 0 1 -1 1a1.001 1.001 0 1 1 -.005 -2c.557 0 1.005 .448 1.005 1" />
              <path d="M13.015 13a1 1 0 0 1 -1 1a1.001 1.001 0 1 1 -.005 -2c.557 0 1.005 .448 1.005 1" />
              <path d="M17.02 13a1 1 0 0 1 -1 1a1.001 1.001 0 1 1 -.005 -2c.557 0 1.005 .448 1.005 1" />
              <path d="M12.02 15a1 1 0 0 1 0 2a1.001 1.001 0 1 1 -.005 -2z" />
              <path d="M9.015 16a1 1 0 0 1 -1 1a1.001 1.001 0 1 1 -.005 -2c.557 0 1.005 .448 1.005 1" />
            </svg>
            <span className="text-s whitespace-nowrap">
              {pickUpDate && dropOffDate
                ? `${formatDate(pickUpDate)} — ${formatDate(dropOffDate)}`
                : "Seleccioná un rango"}
            </span>
          </div>

          {showPicker && (
            <div className="absolute top-full left-0 z-10 mt-1 grid w-full grid-cols-2 gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
              <div>
                <label className="text-xs text-gray-400 uppercase">Desde</label>
                <DatePicker
                  selected={
                    pickUpDate ? new Date(pickUpDate + "T00:00:00") : null
                  }
                  onChange={handlePickUpChange}
                  minDate={new Date()}
                  dayClassName={(date) =>
                    isReserved(date)
                      ? "bg-[#FF8A80] text-white rounded-full"
                      : ""
                  }
                  placeholderText="Desde"
                  className="w-full rounded-md border border-gray-200 bg-gray-50 px-2 py-1.5 text-xs"
                  // onInputClick={recalculateBibliokarmas()}
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase">Hasta</label>
                <DatePicker
                  selected={
                    dropOffDate ? new Date(dropOffDate + "T00:00:00") : null
                  }
                  onChange={handleDropOffChange}
                  minDate={
                    pickUpDate ? new Date(pickUpDate + "T00:00:00") : new Date()
                  }
                  dayClassName={(date) =>
                    isReserved(date)
                      ? "bg-[#FF8A80] text-white rounded-full"
                      : ""
                  }
                  placeholderText="Hasta"
                  className="w-full rounded-md border border-gray-200 bg-gray-50 px-2 py-1.5 text-xs"
                  // onInputClick={recalculateBibliokarmas()}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===== Summary ===== */}
      <div className="flex flex-col gap-3 border-t border-gray-100 pt-3 text-sm">
        <div className="flex justify-between rounded bg-[#F8FAFC] px-3 py-1">
          <span className="text-gray-500">Recogida</span>
          <span className="font-semibold text-gray-800">
            {formatDate(pickUpDate) || "—"}
          </span>
        </div>
        <div className="flex justify-between rounded bg-[#F8FAFC] px-3 py-1">
          <span className="text-gray-500">Devolución</span>
          <span className="font-semibold text-gray-800">
            {formatDate(dropOffDate) || "—"}
          </span>
        </div>
        <div className="flex justify-between rounded bg-[#F8FAFC] px-3 py-1">
          <span className="text-gray-500">Duración</span>
          <span className="font-semibold text-blue-500">
            {calculateDays()} días
          </span>
        </div>
      </div>

      {/* ===== Confirm Button ===== */}
      <button
        onClick={handleConfirmReservation}
        disabled={
          !pickUpDate ||
          !dropOffDate ||
          isDateReserved(pickUpDate) ||
          isDateReserved(dropOffDate)
        }
        className="mt-1 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#FF8A80] py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Confirmar Reserva
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
          <path d="M9 12l2 2l4 -4" />
        </svg>
      </button>
    </div>
  )
}
