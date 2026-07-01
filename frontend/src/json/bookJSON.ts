import type { BookGender } from "@/types/bookGender"
import type { BookType } from "@/types/bookType"
import type { BookCondition } from "@/types/bookCondition"
import type { Languages } from "@/types/languages"
import type { UserProfileJSON } from "./userProfileJSON"
import { Book } from "@/domain/book"
import { getId } from "@/context/AuthContext"

export type BookJSON = {
  id: string
  title: string
  bookType: BookType // string?
  desc: string
  gender: BookGender // string?
  authorName: string
  authorAvatarUrl: string
  numPages: number
  isbn: string
  language: Languages // string?
  editorial: string
  publishDate: Date
  condition: string
  reservetionsIds: number[]
  owner: UserProfileJSON
  imageSrc: string
}

export type ProfileBookJSON = {
  id: string
  title: string
  author: string
  gender: BookGender
  timestamp: Date
  imageSrc: string
  state: string
  clicks: number
}

//esto es para la creacion/actualizacion del libro

export type BookCreateDTO = {
  ownerId: string
  book: {
    bookType: BookType
    title: string
    desc: string
    gender: BookGender
    author: {
      name: string
      avatar: string
    }
    numPages: number
    isbn: string
    language: Languages
    editorial: string
    publishDate: string
    condition: BookCondition
    imageSrc: string
  }
}

export const toBookCreateDTO = (book: Book): BookCreateDTO => ({
  ownerId: String(getId()),
  book: {
    bookType: book.bookType,
    title: book.title,
    desc: book.desc,
    gender: book.gender,
    author: {
      name: book.author.name,
      avatar: book.author.avatar,
    },
    numPages: book.numPages,
    isbn: book.isbn,
    language: book.language,
    editorial: book.editorial,
    publishDate: book.publishDate
      ? new Date(book.publishDate).toISOString().split("T")[0]
      : "",
    condition: book.condition,
    imageSrc: book.imageSrc,
  },
})
