import axios from "axios"
import { getAxiosData } from "./common"
// import { mapReservation, type ReservationDTO } from "@/types/reservationType"
import { getId } from "@/context/AuthContext"

import type { ReservationDates } from "@/types/reservationDates"
import type { ProfilePageable } from "@/pages/Profile"

class ReserveService {
  get id() {
    return getId()
  }

  async getUserReadBooksNumber(): Promise<number> {
    return getAxiosData<number>(() =>
      axios.get<number>(
        import.meta.env.VITE_API_URL + `/userReadBooks/${this.id}`,
      ),
    )
  }

  async createReservation(
    bookId: string,
    pickUpDate: string,
    dropOffDate: string,
  ) {
    const sessionId = this.id
    return axios.post(import.meta.env.VITE_API_URL + "/create-reservation", {
      bookId,
      sessionId,
      pickUpDate,
      dropOffDate,
    })
  }

  async getReservesByUserId(
    userId: number,
    search: string,
    page: number,
    pageSize: number,
  ) {
    // ): Promise<ReservationDTO[]> {
    const { data } = await axios.get(
      import.meta.env.VITE_API_URL + "/lector/" + userId,
      {
        params: { search, page, pageSize },
      },
    )
    // console.log(data, "del user")
    return data
  }

  async getLoansMadeByUserId(
    userId: number,
    search: string,
    page: number,
    pageSize: number,
  ) {
    // ): Promise<ReservationDTO[]> {
    const { data } = await axios.get(
      import.meta.env.VITE_API_URL + "/owner/" + userId,
      {
        params: { search, page, pageSize },
      },
    )
    console.log(data, "que le hicieron al user")
    return data
  }

  async rateLoan(
    reservationId: number,
    body: { rate: number; review: string },
  ) {
    const { data } = await axios.post(
      import.meta.env.VITE_API_URL + "/" + reservationId + "/calificar",
      {
        id: 0,
        reviewerName: "", // el back lo resuelve con el userId
        rating: body.rate,
        review: body.review,
        timestamp: new Date().toISOString().split("T")[0], // "2024-03-19"
      },
      {
        params: { userId: this.id }, // esto es por lo que pusieron en el back en el model de review no se como funciona
      },
    )
    // console.log(data) // no se que onda esto
    return data
  }

  async getUserOwnBooks(pageable: ProfilePageable) {
    const { data } = await axios.get(
      import.meta.env.VITE_API_URL + `/userOwnBooks/${this.id}`,
      { params: pageable },
    )

    // console.log(data)
    return data
  }

  async getUserLentBooksNumber(): Promise<number> {
    return getAxiosData<number>(() =>
      axios.get<number>(
        import.meta.env.VITE_API_URL + `/userLentBooks/${this.id}`,
      ),
    )
  }

  async getReservedDates(bookId: string) {
    return axios.get<ReservationDates[]>(
      `${import.meta.env.VITE_API_URL}/reservations/book/${bookId}/dates`,
    )
  }

  async getBibliokarmas(
    bookId: string,
    userId: string,
    pickUpDate: string,
    dropOffDate: string,
  ) {
    return axios.get<number>(
      `${import.meta.env.VITE_API_URL}/book-detail/${bookId}/bibliokarmas`,
      {
        params: {
          userId,
          pickUpDate,
          dropOffDate,
        },
      },
    )
  }
}

export const reserveService = new ReserveService()
