import type { BookGender } from "./bookGender"


export type BookFilters = {
  // userId: number,
  title: string,
  genders: BookGender[],
  pagesRangeMin: number,
  pagesRangeMax: number,
  pickUpDate: string, //! ISO string
  dropOffDate: string, //! ISO string
  isbn: string,
  ownersName: string,
  page: number,
  pageSize: number,
  sortBy: string,
  ascending: boolean,
}