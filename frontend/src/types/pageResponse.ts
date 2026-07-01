

export class PageResponse<T> {
  content: T[]
  page: number
  pageSize: number
  totalElements: number
  totalPages: number

  constructor(
    content: T[],
    page: number,
    pageSize: number,
    totalElements: number,
    totalPages: number
  ) {
    this.content = content
    this.page = page
    this.pageSize = pageSize
    this.totalElements = totalElements
    this.totalPages = totalPages
  }
}