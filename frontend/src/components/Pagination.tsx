type PaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

function getVisiblePages(currentPage: number, totalPages: number): (number | string)[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i)
  }

  const pages: (number | string)[] = []

  const firstPage = 0
  const lastPage = totalPages - 1

  pages.push(firstPage)

  if (currentPage > 2) {
    pages.push("start-ellipsis")
  }

  const start = Math.max(1, currentPage - 1)
  const end = Math.min(lastPage - 1, currentPage + 1)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  if (currentPage < totalPages - 3) {
    pages.push("end-ellipsis")
  }

  pages.push(lastPage)

  return pages
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange
}: PaginationProps) => {
  if (totalPages < 1) return null

  const visiblePages = getVisiblePages(currentPage, totalPages)
  // console.log("Visible Pages:", visiblePages)

  return (
    <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        Anterior
      </button>

      {visiblePages.map((item, index) =>
        typeof item === "string" ? (
          <span key={`${item}-${index}`} className="px-2 text-gray-500">
            ...
          </span>
        ) : (
          <button
            key={item}
            onClick={() => onPageChange(item)}
            className={`min-w-10 h-10 px-3 rounded-lg border text-sm font-medium transition ${
              currentPage === item
                ? "bg-blue-500 text-white font-bold hover:bg-blue-700"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            {item + 1}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        Siguiente
      </button>
    </div>
  )
}

export default Pagination