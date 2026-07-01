import { Book } from "@/domain/book"
import type { BookFilters } from "@/types/bookFilters"
import axios from "axios"
import { getAxiosData } from "./common"
import { toBookCreateDTO, type BookJSON } from "@/json/bookJSON"
import type { PageResponse } from "@/types/pageResponse"
import customAxios from "@/config/customAxios"
import { BookGender } from "@/types/bookGender"
import { getId } from "@/context/AuthContext"
import type { BookReview } from "@/domain/review"

class BookService {
  async createBook(book: Book): Promise<Book> {
    const response = () =>
      axios.post<Book>(import.meta.env.VITE_API_URL + `/create-book`, toBookCreateDTO(book))
    return await getAxiosData(response)
  }

  async updateBook(id: string, book: Book): Promise<Book> {
    const dto = toBookCreateDTO(book)
    const response = () =>
      axios.put<Book>(import.meta.env.VITE_API_URL + `/edit-book/${id}`, dto)
    return await getAxiosData(response)
  }

  async deleteBook(id: string): Promise<void> {
    await axios.delete(import.meta.env.VITE_API_URL + `/delete-book/${id}`)
  }

  // -- LIBROS FILTRADOS PARA PAGINACION EN HOME --
  async getFilteredBooksPage(
    filters: BookFilters,
  ): Promise<PageResponse<BookJSON>> {
    const response = () =>
      customAxios.get<PageResponse<BookJSON>>(
        import.meta.env.VITE_API_URL + `/filtered-books`,
        {
          params: {
            // hace que axios los serialice como query string
            userId: getId(),
            ...filters,
          },
        },
      )
    const data = (await response()).data
    // console.log(data)
    return data
  }

  async getBookDetail(id: string) {
    const queryById = () =>
      axios.get<BookJSON>(import.meta.env.VITE_API_URL + "/book-detail/" + id, {
        params: { userId: getId() },
      }) 
    const bookJSON = await getAxiosData(queryById)
    return Book.fromJSON(bookJSON)
  }

  async registerClick(id: string) {
    const response = () =>
      axios.post(import.meta.env.VITE_API_URL + `/book-detail/${id}/click`, null, { 
        params: { userId: getId() }
      })
    return await getAxiosData(response)
  }

  async getBookGenders() {
    const response = () =>
      axios.get<string[]>(import.meta.env.VITE_API_URL + `/book-genders`)
    const data = await getAxiosData(response)

    const genderFilters = data.map((gender) => {
      return {
        value: gender,
        label: BookGender[gender as keyof typeof BookGender],
        checked: false,
      }
    })

    return genderFilters
  }

  async getReviews(bookId: string, page: number, pageSize: number) {
      return axios.get<BookReview[]>(
        `${import.meta.env.VITE_API_URL}/book-review/${bookId}?page=${page}&pageSize=${pageSize}`,
      )
  }
}

export const bookService = new BookService()
