import { ArrowsDownUpIcon, PlusCircleIcon } from "@phosphor-icons/react"
import { Link } from "react-router"
import Tag from "./Tag"
import ProfileBook from "./ProfileBook"
import PaginationButtons from "./PaginationButtons"
import type { ProfilePageable } from "@/pages/Profile"
import { reserveService } from "@/services/reserveService"
import { HttpStatusCode } from "axios"
import { showToast } from "@/utils/toast"
import { useState } from "react"
import type { ProfileBookJSON } from "@/json/bookJSON"
import { BookProfile } from "@/domain/bookProfile"
import { useOnInit } from "@/hooks/UseOnInit"
import { UserKind } from "@/types/userKind"
import { IconBookOff } from "@tabler/icons-react"

export default function ProfileBookList({ userKind }: { userKind: string }) {
  const [shownBooks, setShownBooks] = useState<ProfileBookJSON[]>([])
  const [filter, setFilter] = useState<string>("ALL")
  const [sort, setSort] = useState<string>("DATE_DESC")
  const [activePage, setActivePage] = useState<number>(0)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [loading, setLoading] = useState(true)
  const [totalBooksNumber, setTotalBooksNumber] = useState<number>(0)

  let pageSize: number = 4

  let isReader: boolean = userKind === UserKind.READER

  let disabledButtonCondition: string = isReader
    ? "disabled:opacity-50 disabled:cursor-not-allowed"
    : ""

  const toggleTitleSort = () => {
    const newSort =
      sort == "ALPHABETICAL_ASC" ? "ALPHABETICAL_DESC" : "ALPHABETICAL_ASC"
    setSort(newSort)
    getUserOwnBooks(filter, newSort, activePage)
  }

  const toggleDateSort = () => {
    const newSort = sort == "DATE_ASC" ? "DATE_DESC" : "DATE_ASC"
    setSort(newSort)
    getUserOwnBooks(filter, newSort, activePage)
  }

  const toggleClicksSort = () => {
    const newSort = sort == "CLICKS_ASC" ? "CLICKS_DESC" : "CLICKS_ASC"
    setSort(newSort)
    getUserOwnBooks(filter, newSort, activePage)
  }

  const getUserOwnBooks = async (
    filterCriteria: string,
    sortCriteria: string,
    page: number,
  ) => {
    setFilter(filterCriteria)
    let pageable: ProfilePageable = {
      filterCriteria,
      sortCriteria,
      page,
      pageSize,
    }
    // console.log(pageable)
    try {
      const backResponse = await reserveService.getUserOwnBooks(pageable)
      setShownBooks(backResponse.items.map(BookProfile.fromJSON))
      setTotalPages(backResponse.totalPages)
      setTotalBooksNumber(backResponse.total)
    } catch (error: any) {
      if (error.response?.status == HttpStatusCode.Forbidden) {
        return
      }
      showToast.httpError(error, "Error al buscar sus libros")
    } finally {
      setLoading(false)
    }
  }

  useOnInit(() => {
    if (userKind === UserKind.READER) {
      setLoading(false)
      return
    }
    getUserOwnBooks(filter, sort, 0)
  })

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <section className="mb-4 flex justify-between">
        <p className="text-2xl font-bold">Gestión de Mis Libros</p>
        {userKind !== UserKind.READER
          ? <Link
              to="/crear-libro"
              className={`cursor-pointer rounded-lg bg-red-300 p-1.5 text-sm hover:bg-red-400 ${disabledButtonCondition}`}
            >
              <PlusCircleIcon size={20} className="mr-1 inline" />
              <p className="inline font-bold">Agregar Nuevo Libro</p>
            </Link>
          : (
          <section className="opacity-50 cursor-not-allowed">  
            <PlusCircleIcon size={20} className="mr-1 inline" />
            <p className="inline">Agregar Nuevo Libro</p>
          </section>)
        }
        
      </section>

      <section className="flex h-102 min-h-0 flex-1 flex-col gap-1 overflow-hidden rounded-xl border border-gray-200 bg-white">
        <section className="flex gap-2 p-4">
          <Tag
            disabled={isReader}
            disabledCondition={disabledButtonCondition}
            filterKind="ALL"
            filter={filter}
            text="Todos"
            buttonOnClickFunction={() => {
              setActivePage(0)
              getUserOwnBooks("ALL", sort, 0)
            }}
          ></Tag>
          <Tag
            disabled={isReader}
            disabledCondition={disabledButtonCondition}
            filterKind="AVAILABLE"
            filter={filter}
            text="Disponibles"
            buttonOnClickFunction={() => {
              setActivePage(0)
              getUserOwnBooks("AVAILABLE", sort, 0)
            }}
          ></Tag>
          <Tag
            disabled={isReader}
            disabledCondition={disabledButtonCondition}
            filterKind="BORROWED"
            filter={filter}
            text="Prestados"
            buttonOnClickFunction={() => {
              setActivePage(0)
              getUserOwnBooks("BORROWED", sort, 0)
            }}
          ></Tag>
        </section>
        <section className="flex items-center gap-4 pr-2 pl-2 text-sm text-gray-500">
          <div className="flex flex-1 items-center justify-between">
            <p>Titulo y Autor</p>
            <button
              className={`hover:cursor-pointer ${disabledButtonCondition}`}
              disabled={isReader}
            >
              <ArrowsDownUpIcon
                size={15}
                onClick={() => {
                  toggleTitleSort()
                }}
              />
            </button>
          </div>
          <div className="flex w-24 gap-3 items-center justify-center">
            <p>Clicks</p>
            <button
              className={`hover:cursor-pointer ${disabledButtonCondition}`}
              disabled={isReader}
            >
              <ArrowsDownUpIcon
                size={15}
                onClick={() => {
                  toggleClicksSort()
                }}
              />
            </button>
          </div>
          <div className="flex w-28 items-center justify-center">
            <p>Disponibilidad</p>
          </div>
          <div className="flex w-24 items-center justify-center">
            <p>Agregado</p>
            <button
              className={`hover:cursor-pointer ${disabledButtonCondition}`}
              disabled={isReader}
            >
              <ArrowsDownUpIcon
                size={15}
                onClick={() => {
                  toggleDateSort()
                }}
              />
            </button>
          </div>
          <p className="w-16 text-center">Acciones</p>
        </section>
        {loading ? (
          <div className="flex h-64 items-center justify-center text-gray-400">
            Cargando...
          </div>
        ) : userKind != UserKind.READER ? (
          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            <section className="min-h-0 flex-1 overflow-y-auto pr-1">
              {shownBooks.map((book) => (
                <ProfileBook
                  key={book.id}
                  bookId={book.id}
                  bookImg={book.imageSrc}
                  bookAuthor={book.author}
                  bookGender={book.gender}
                  bookName={book.title}
                  bookState={book.state}
                  timestamp={book.timestamp}
                  clicks={book.clicks}
                  onDelete={() => getUserOwnBooks(filter, sort, activePage)}
                />
              ))}
            </section>
            <PaginationButtons
              page={activePage}
              listSize={shownBooks.length}
              totalPages={totalPages}
              onPageChange={(newPage) => {
                setActivePage(newPage)
                getUserOwnBooks(filter, sort, newPage)
              }}
              filteredBooksLength={totalBooksNumber}
            />
          </div>
        ) : (<section className="flex flex-1 flex-col items-center justify-center text-center text-gray-400">
          <IconBookOff size={48} className="mb-3 text-gray-300" />
          <p className="font-medium">Los lectores no pueden gestionar libros.</p>
          <p className="text-sm">Cambiá tu tipo de perfil a Publicador o Lector / Publicador para acceder a esta sección.</p>
        </section>
        )}
      </section>
    </div>
  )
}
