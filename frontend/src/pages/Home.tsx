"use client"

import { useEffect, useState } from "react"
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItems,
} from "@headlessui/react"
// import { XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon, MinusIcon, PlusIcon } from "@heroicons/react/20/solid"
import { IconSearch } from "@tabler/icons-react"
import { Book } from "@/domain/book"
import BookCardHome from "@/components/BookCardHome"
import { BookGender } from "@/types/bookGender"
import type { BookFilters } from "@/types/bookFilters"
import MultiRangeSlider from "@/components/MultiRangeSlider/MultiRangeSlider"
import { addDays } from "@/utils/addDays"
import Pagination from "@/components/Pagination"
import { bookService } from "@/services/bookService"
import OrderDirectionArrow from "@/components/OrderDirectionArrow/OrderDirectionArrow"
import { useOnInit } from "@/hooks/UseOnInit"
import { showToast } from "@/utils/toast"
import SelectSorting from "@/components/SelectSorting"
import { useSearchParams } from "react-router"

const initialSortOptions = [
  { name: "Título", value: "title", current: true },
  { name: "Autor", value: "author.name", current: false },
  { name: "Dueño", value: "owner.name", current: false },
  { name: "Relevancia", value: "bookClicks", current: false },
  // { name: "Relevancia", value: "bookClicks", current: false },
]

const initialFilters: BookFilters = {
  title: "",
  genders: [], //! debe ser value de keyof enum BookGender
  pagesRangeMin: 0,
  pagesRangeMax: 1500,
  pickUpDate: new Date().toISOString().split("T")[0],
  dropOffDate: addDays(new Date(), 1).toISOString().split("T")[0], // 1 dia despues
  // dropOffDate: new Date().toISOString().split("T")[0], // mismo dia
  isbn: "",
  ownersName: "",
  page: 0,
  pageSize: 6,
  sortBy: "title",
  ascending: true,
}

export default function Home() {
  // FILTERING, SORTING AND PAGINATION STATES
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
  const [searchParams, setSearchParams] = useSearchParams()
  

  // Leer los filtros de la URL con fallback a initialFilters
  const filtersFromURL = (): BookFilters => ({
    title: searchParams.get("title") ?? initialFilters.title,
    genders: searchParams.getAll("genders") ?? initialFilters.genders,
    pagesRangeMin: Number(searchParams.get("pagesRangeMin") ?? initialFilters.pagesRangeMin),
    pagesRangeMax: Number(searchParams.get("pagesRangeMax") ?? initialFilters.pagesRangeMax),
    pickUpDate: searchParams.get("pickUpDate") ?? initialFilters.pickUpDate,
    dropOffDate: searchParams.get("dropOffDate") ?? initialFilters.dropOffDate,
    isbn: searchParams.get("isbn") ?? initialFilters.isbn,
    ownersName: searchParams.get("ownersName") ?? initialFilters.ownersName,
    page: Number(searchParams.get("page") ?? initialFilters.page),
    pageSize: Number(searchParams.get("pageSize") ?? initialFilters.pageSize),
    sortBy: searchParams.get("sortBy") ?? initialFilters.sortBy,
    ascending: searchParams.get("ascending") !== "false", // Si ascending es "false", daria false de resultado. 
    // No puedo parsear con Boolean() porque las strings son truthy, entonces daria true siempre.
  })

  const initialState = filtersFromURL()
  const [filters, setFilters] = useState<BookFilters>(initialState)
  const [sortingOptions, setSortingOptions] = useState(initialSortOptions.map((option) => ({
        ...option,
        current: option.value === initialState.sortBy,
      })))
  const [page, setPage] = useState(initialState.page)
  const [totalPages, setTotalPages] = useState(0)

  //* SYNC FILTERS WITH URL
  const syncToURL = (newFilters: BookFilters) => {
    const params = new URLSearchParams()
    
    if (newFilters.title) params.set("title", newFilters.title)
    newFilters.genders.forEach((g) => params.append("genders", g))
    params.set("pagesRangeMin", String(newFilters.pagesRangeMin))
    params.set("pagesRangeMax", String(newFilters.pagesRangeMax))
    params.set("pickUpDate", newFilters.pickUpDate)
    params.set("dropOffDate", newFilters.dropOffDate)
    if (newFilters.isbn) params.set("isbn", newFilters.isbn)
    if (newFilters.ownersName) params.set("ownersName", newFilters.ownersName)
    params.set("page", String(newFilters.page))
    params.set("pageSize", String(newFilters.pageSize))
    params.set("sortBy", newFilters.sortBy)
    params.set("ascending", String(newFilters.ascending))
    
    setSearchParams(params, { replace: true })
  }

  //* ==== GET DATA ====
  const getFilteredBooksPage = async (newFilters: BookFilters) => {
    // console.log("newFilters: ", newFilters)
    try {
      const response = await bookService.getFilteredBooksPage(newFilters)
      const filtered = response.content.map((book) => Book.fromJSON(book))
      // console.log("books: ", filtered)
      setFilteredBooks(filtered)
      setTotalPages(response.totalPages)
    } catch (error) {
      // console.error("Error fetching filtered books: ", error)
      showToast.httpError(error, "Error al realizar la busqueda: ")
      // setTimeout(() => navigate("/login"), 2000)
    }
  }

  //* ==== FILTERS UPDATE ====
  const updateSimpleFilter = <K extends keyof BookFilters>(
    key: K,
    value: BookFilters[K],
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
    return { ...filters, [key]: value } // devuelvo los filtros mas actualizados
  }

  const toggleGenderFilter = (gender: BookGender) => {
    setFilters((prev) => {
      const alreadySelected = prev.genders.includes(gender)

      return {
        ...prev,
        genders: alreadySelected
          ? prev.genders.filter((g) => g !== gender)
          : [...prev.genders, gender],
      }
    })
  }

  //* ==== DATES MAINTENANCE ====
  const today = new Date().toISOString().split("T")[0]
  const handlePickUpDate = (pickUpDateStr: string) => {
    // Actualizo la fecha de inicio
    updateSimpleFilter("pickUpDate", pickUpDateStr)
    // Valido si es despues de la fecha de fin
    const pickUpDate = new Date(pickUpDateStr)
    const dropOffDate = new Date(filters.dropOffDate)
    if (pickUpDate.getTime() > dropOffDate.getTime()) {
      // Si lo es, modifico la fecha de fin para que se despues de la de inicio
      pickUpDate.setDate(pickUpDate.getDate() + 1) // Le sumo un dia
      updateSimpleFilter("dropOffDate", pickUpDate.toISOString().split("T")[0])
    }
  }

  //* ==== PAGE RANGE VALUES ====
  const handleRangeChange = (values: { min: number; max: number }) => {
    updateSimpleFilter("pagesRangeMin", values.min)
    updateSimpleFilter("pagesRangeMax", values.max)
  }

  //* ==== SORTING ====
  const updateSortOptions = (selectedOption: string) => {
    setSortingOptions((prev) =>
      prev.map((option) => ({
        ...option,
        current: option.value === selectedOption,
      })),
    )
    const newFilters = updateSimpleFilter("sortBy", selectedOption)
    syncToURL(newFilters)
    getFilteredBooksPage(newFilters)
  }

  const toggleSortDirection = () => {
    const newFilters = updateSimpleFilter("ascending", !filters.ascending)
    syncToURL(newFilters)
    getFilteredBooksPage(newFilters)
  }

  //* ==== PAGE CHANGE ====
  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    const newFilters = updateSimpleFilter("page", newPage)
    syncToURL(newFilters)
    getFilteredBooksPage(newFilters)
  }

  //* ==== APPLY FILTERS & RESTART PAGE ====
  const handleApplyFilters = () => {
    //  console.log("Applying filters: ", filters)
    setPage(0)
    const newFilters = updateSimpleFilter("page", 0)
    syncToURL(newFilters)
    getFilteredBooksPage(newFilters)
  }

  //* ==== CLEAR FILTERS & RESTART PAGE ====
  {
    /* Cuando key cambia, React desmonta y vuelve a montar el componente desde cero, 
  reseteando su estado interno (minVal, maxVal) a los valores iniciales min y max. */
  }
  const [filterKey, setFilterKey] = useState(0)

  const handleClearFilters = () => {
    updateSortOptions(initialSortOptions[0].value) // resetea la opcion de ordenamiento al default
    setFilters(initialFilters)
    handleApplyFilters()
    setFilterKey((prev) => prev + 1) // fuerza el remount del slider
  }

  //! ==== ON INIT ====
  const [genderFilters, setGendersFilters] = useState<
    { value: string; label: string; checked: boolean }[]
  >([])
  useOnInit(async () => {
    getFilteredBooksPage(initialState)
    const genderOptions = await bookService.getBookGenders()
    setGendersFilters(genderOptions)
    handleRangeChange({
      min: initialState.pagesRangeMin,
      max: initialState.pagesRangeMax,
    })
    syncToURL(initialState)
  })

  //! ==== ON KEY PRESS ====
  //* Se ejecuta antes de useOnInit y lanza el toast
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        handleApplyFilters()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [filters])

  return (
    <div className="w-full">
      <div>
        {/* =============== MAIN ================ */}
        <main className="mx-auto w-[80%] px-4 sm:px-6 lg:px-8">
          <section aria-labelledby="products-heading" className="pt-6 pb-24">
            <h1 id="products-heading" className="sr-only">
              Products
            </h1>

            {/* ========== PRODUCTOS + FILTERS ========== */}
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-[300px_1fr]">
              {/* ========== FILTERS ========== */}
              <form className="mt-7 flex hidden h-max flex-col rounded-2xl border border-gray-200 bg-white p-5 lg:flex">
                {/* ========== GENDER FILTERS ========== */}
                <Disclosure
                  key="gender-filter"
                  as="div"
                  className="border-b border-gray-200 py-6"
                >
                  <h3 className="-my-3 flow-root">
                    <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                      <span className="font-medium text-gray-900">GENERO</span>
                      <span className="ml-6 flex items-center">
                        <PlusIcon
                          aria-hidden="true"
                          className="size-5 group-data-open:hidden"
                        />
                        <MinusIcon
                          aria-hidden="true"
                          className="size-5 group-not-data-open:hidden"
                        />
                      </span>
                    </DisclosureButton>
                  </h3>
                  <DisclosurePanel className="pt-6">
                    <div className="space-y-4">
                      {genderFilters.map((option, optionIdx) => (
                        <div
                          key={`${option.value}-${filterKey}`}
                          className="flex gap-3"
                        >
                          <div className="flex h-5 shrink-0 items-center">
                            <div className="group grid size-4 grid-cols-1">
                              <input
                                defaultValue={option.value}
                                defaultChecked={option.checked}
                                id={`gender-filter-${optionIdx}`}
                                name={`gender-filter[]`}
                                type="checkbox"
                                className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                                onClick={() =>
                                  toggleGenderFilter(option.value as BookGender)
                                }
                              />
                              <svg
                                fill="none"
                                viewBox="0 0 14 14"
                                className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                              >
                                <path
                                  d="M3 8L6 11L11 3.5"
                                  strokeWidth={2}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="opacity-0 group-has-checked:opacity-100"
                                />
                                <path
                                  d="M3 7H11"
                                  strokeWidth={2}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="opacity-0 group-has-indeterminate:opacity-100"
                                />
                              </svg>
                            </div>
                          </div>
                          <label
                            htmlFor={`gender-filter-${optionIdx}`}
                            className="text-sm text-gray-600"
                          >
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </DisclosurePanel>
                </Disclosure>

                {/* ========== NUM PAGE RANGE FILTERS ========== */}
                <Disclosure
                  key="numPageRangeFilter"
                  as="div"
                  className="border-b border-gray-200 py-6"
                >
                  <label
                    htmlFor="steps-range"
                    className="text-heading mb-2.5 block text-sm font-medium"
                  >
                    RANGO DE PÁGINAS
                  </label>
                  <MultiRangeSlider
                    key={`numPageRangeFilter-${filterKey}`} // cuando cambia, React destruye y recrea el componente
                    min={0}
                    max={1500}
                    initialMin={filters.pagesRangeMin}
                    initialMax={filters.pagesRangeMax}
                    onChange={handleRangeChange}
                    trackColor={"#cecece"}
                    rangeColor={"#2790F1"}
                    width={"260px"}
                  />
                </Disclosure>

                {/* ========== RESERVATION DATES RANGE FILTERS ========== */}
                <Disclosure
                  key="reservationDatesRangeFilter"
                  as="div"
                  className="border-b border-gray-200 py-6"
                >
                  <label className="text-heading mb-2.5 block text-sm font-medium">
                    RANGO DE FECHAS DE RESERVA
                  </label>
                  <div className="align-items-center grid w-full grid-cols-2 justify-center gap-x-2">
                    <input
                      type="date"
                      name=""
                      id="date-from"
                      className="rounded border border-gray-200 bg-gray-100 px-2 py-2 text-sm text-gray-500 focus:outline-none"
                      value={filters.pickUpDate}
                      min={today}
                      onChange={(e) => handlePickUpDate(e.target.value)}
                    />
                    <input
                      type="date"
                      name=""
                      id="date-to"
                      className="rounded border border-gray-200 bg-gray-100 px-2 py-2 text-sm text-gray-500 focus:outline-none"
                      value={filters.dropOffDate}
                      min={filters.pickUpDate || today}
                      onChange={(e) =>
                        updateSimpleFilter("dropOffDate", e.target.value)
                      }
                    />
                  </div>
                </Disclosure>

                {/* ========== DETAILS FILTERS ========== */}
                <Disclosure
                  key="detailsFilter"
                  as="div"
                  className="flex flex-col gap-y-4 border-b border-gray-200 py-6"
                >
                  <label className="text-heading mb-2.5 block text-sm font-medium">
                    DETALLES
                  </label>

                  <div className="align-items-start flex flex-col justify-start">
                    <label htmlFor="isbn" className="text-gray-600">
                      ISBN
                    </label>
                    <input
                      type="text"
                      name="isbn"
                      id="isbn"
                      placeholder="978-950-xxxx-xx-x"
                      className="rounded border border-gray-200 bg-gray-100 px-4 py-2 text-sm text-gray-600"
                      value={filters.isbn}
                      onChange={(e) =>
                        updateSimpleFilter("isbn", e.target.value)
                      }
                    />
                  </div>

                  <div className="align-items-start flex flex-col justify-start">
                    <label htmlFor="owner" className="text-gray-600">
                      Prestado por
                    </label>
                    <input
                      type="text"
                      name="owner"
                      id="owner"
                      placeholder="Usuario..."
                      className="rounded border border-gray-200 bg-gray-100 px-4 py-2 text-sm text-gray-600"
                      value={filters.ownersName}
                      onChange={(e) =>
                        updateSimpleFilter("ownersName", e.target.value)
                      }
                    />
                  </div>
                </Disclosure>

                {/* ========== APPLY FILTERS ========== */}
                <Disclosure
                  key="applyFiltersBtn"
                  as="div"
                  className="grid grid-cols-2 justify-center gap-x-4 border-b border-gray-200 py-6"
                >
                  <button
                    type="button"
                    onClick={() => handleApplyFilters()}
                    className="mt-4 inline-block rounded-xl bg-blue-500 px-6 py-2.5 text-sm font-semibold text-white transition-all duration-150 ease-out hover:scale-[1.08] hover:bg-blue-600"
                  >
                    Aplicar Filtros
                  </button>
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="mt-4 inline-block rounded-xl border border-blue-500 bg-white px-6 py-2.5 text-sm font-semibold text-blue-500 transition-all duration-150 ease-out hover:scale-[1.08] hover:bg-blue-600 hover:text-white"
                  >
                    Limpiar Filtros
                  </button>
                </Disclosure>
              </form>

              {/* ========== BUSQUEDA + ORDENAR + PRODUCTOS ========== */}
              <div className="flex-col items-center justify-center gap-y-4 lg:block lg:flex">
                {/* ========== BUSQUEDA POR TITULO ========== */}
                <div className="flex w-full flex-col gap-y-2 rounded-2xl border border-gray-200 bg-white p-10">
                  <h1 className="text-4xl font-bold">
                    Encuentra tu próxima lectura
                  </h1>
                  <p className="text-gray-400">
                    Explora miles de libros disponibles para préstamo en nuestra
                    comunidad.
                  </p>

                  <div className="grid w-full grid-cols-3 grid-cols-[min-content_1fr_min-content] items-center justify-start gap-x-2 rounded-lg border border-gray-200 bg-gray-100 px-5 py-2">
                    <IconSearch stroke={2} className="text-gray-400" />
                    <input
                      type="text"
                      name="owner"
                      id="owner"
                      placeholder="Buscar por título..."
                      className="selected:bg-gray-100 rounded bg-gray-100 px-4 py-2 text-sm text-gray-600 focus:outline-none"
                      value={filters.title}
                      onChange={(e) =>
                        updateSimpleFilter("title", e.target.value)
                      }
                    />
                    <button
                      onClick={() => handleApplyFilters()}
                      className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
                    >
                      Buscar
                    </button>
                  </div>
                </div>

                {/* ========== ORDERAR POR ========== */}
                <div className="flex w-full items-baseline justify-between border-b border-gray-200 pt-4 pb-6">
                  <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                    Libros populares
                  </h2>

                  <div className="flex items-center">
                    <Menu as="div" className="relative inline-block text-left">
                      <MenuButton className="group text-md inline-flex justify-center font-medium text-gray-700 hover:text-gray-900">
                        Ordenar por:
                        <span className="text-md pl-2 text-blue-400">
                          {sortingOptions.find((o) => o.current)?.name}
                        </span>
                        <ChevronDownIcon
                          aria-hidden="true"
                          className="-mr-1 ml-1 size-5 shrink-0 text-gray-400 group-hover:text-gray-500"
                        />
                      </MenuButton>

                      <MenuItems
                        transition
                        className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                      >
                        <div className="py-1">
                          {sortingOptions.map((option) => (
                            <SelectSorting
                              key={`sortingOption-${option.name}-${filterKey}`}
                              option={option}
                              onClick={updateSortOptions}
                            />
                          ))}
                        </div>
                      </MenuItems>
                    </Menu>

                    {/* ========== CAMBIAR DIRECCION DE ORDEN ========== */}
                    <OrderDirectionArrow
                      key={`ascendingBtn-${filterKey}`}
                      onClick={toggleSortDirection}
                      ascending={filters.ascending}
                    />
                  </div>
                </div>

                {/* ============ PRODUCT GRID ============== */}
                <div className="justify-content-center grid grid-cols-1 items-center gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 xl:gap-x-8">
                  {filteredBooks.map((book: Book) => (
                    <BookCardHome key={book.id} book={book}  />
                  ))}
                </div>
                {filteredBooks.length === 0 && (
                  <div className="mt-10 w-full rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-10 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-2xl">
                      <IconSearch size={26} className="text-blue-500" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-800">
                      Ups, nada por aquí.
                    </h2>
                    <p className="text-md mt-1 text-gray-500">
                      Cambiá los filtros o buscá algo distinto.
                    </p>
                  </div>
                )}

                {/* ============ PAGINACION============== */}
                <div className="mt-4 flex items-center justify-center gap-2">
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
