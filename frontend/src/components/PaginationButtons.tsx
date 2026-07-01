export interface FilterValues {
  filter: string,
  orderBy: string
}

export interface ProfilePagination {
  page: number,
  listSize: number,
  totalPages: number,
  onPageChange: (newPage: number) => void
  filteredBooksLength: number
}

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'

export default function PaginationButtons( {page, listSize, totalPages, onPageChange, filteredBooksLength}: ProfilePagination ) {
  const hoverIfMore = page == (totalPages - 1) || totalPages == 0 ?  "" : "hover:cursor-pointer"
  const hoverIfFirst = page == 0 ? "" : "hover:cursor-pointer"

  return (
    <div className="flex items-center justify-between border-t border-white/10 px-4 py-3 sm:px-6">
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <p className="text-sm text-gray-300">
          Mostrando <span className="font-medium">{listSize}</span> de{' '}<span className="font-medium">{filteredBooksLength}</span> resultados
        </p>
        <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md">
          <button
            disabled={page == 0}
            onClick={() => onPageChange(page - 1)}
            className={`${hoverIfFirst} relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 inset-ring inset-ring-gray-700 hover:bg-white/5 focus:z-20 focus:outline-offset-0`}
          >
            <ChevronLeftIcon aria-hidden="true" className="size-5" />
          </button>
          <p className="relative z-10 inline-flex items-center bg-indigo-500 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
            {page + 1}
          </p>
          <button
            disabled={page == totalPages - 1 || totalPages == 0}
            onClick={() => onPageChange(page + 1)}
            className={`${hoverIfMore} relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 inset-ring inset-ring-gray-700 hover:bg-white/5 focus:z-20 focus:outline-offset-0`}
          >
            <span className="sr-only">Next</span>
            <ChevronRightIcon aria-hidden="true" className="size-5" />
          </button>
        </nav>
      </div>
    </div>
  )
}
