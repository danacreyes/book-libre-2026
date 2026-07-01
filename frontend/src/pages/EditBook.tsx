import { InputField } from "@/components/InputField"
import ValidationField from "@/validation/ValidationField"
import { ValidationMessage } from "@/validation/validationMessage"
import { Book } from "@/domain/book"
import { Author } from "@/domain/author"
import { useEffect, useState } from "react"
import { BookGender } from "@/types/bookGender"
import { GenericCombobox } from "@/components/GenericComboBox"
import { Languages } from "@/types/languages"
import { BookCondition } from "@/types/bookCondition"
import { useParams, useNavigate, Link } from "react-router"
import { Button } from "@headlessui/react"
import { bookService } from "@/services/bookService"
import { getId } from "@/context/AuthContext"
import { showToast } from "@/utils/toast"
import { TextareaField } from "@/components/Textarea"
import { BookType, BookTypeLabels } from "@/types/bookType"

export default function EditBook() {
  const defaultImage = "/assets/default-book.jpg"
  const { id } = useParams()
  const isEditing = !!id
  const [errors, setErrors] = useState<Array<ValidationMessage>>([])
  const [book, setBook] = useState<Book>(new Book())
  const navigate = useNavigate()

  useEffect(() => {
    if (!isEditing) return

    const fetchBook = async () => {
      try {
        const found = await bookService.getBookDetail(String(id))
        if (found) {
          if (found.owner.id !==getId()) {
            navigate("/", { replace: true })
            return
          }
          // Trunca en 500 caracteres al cargar del back
          found.desc = found.desc?.slice(0, 1000) ?? ""
          setBook(found)
        }
      } catch (error) {
        showToast.httpError(error, "Error al cargar el libro")
      }
    }

    fetchBook()
  }, [id])

  const updateBook = (key: keyof Book, value: unknown) => {
    setBook((prev) => Object.assign(new Book(), prev, { [key]: value }))
  }

  const handleSubmit = async () => {
    book.validate()

    if (book.errors.length > 0) {
      setErrors(book.errors)
      return
    }

    try {
      if (isEditing) {
        await bookService.updateBook(String(id), book)
        showToast.success(
          "Libro actualizado con éxito, redirigiendote a tu perfil",
        )
        setTimeout(() => {
          navigate("/perfil", { state: { refreshBooks: true } })
        }, 4000)
      } else {
        await bookService.createBook(book)
        showToast.success("Libro creado con éxito, redirigiendote a tu perfil")
        setTimeout(() => {
          navigate("/perfil", { state: { refreshBooks: true } })
        }, 4000)
      }
    } catch (error) {
      showToast.httpError(error, "Error al guardar el libro")
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ================ Breadcrumb ================ */}
      <div className="px-6 py-3">
        <ol className="flex items-center gap-1 text-sm text-gray-500">
          <li>
            <Link to="./" className="hover:text-gray-700">
              Mis Libros
            </Link>
          </li>
          <li>
            <svg
              className="mx-1 inline h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m9 18 6-6-6-6"
              />
            </svg>
          </li>
          <li className="font-medium text-gray-700">
            {isEditing ? "Editar libro" : "Crear libro"}
          </li>
        </ol>
      </div>

      {/* ================ Top Section ================ */}
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8">
        <div className="flex items-start gap-6">
          <div className="flex w-64 shrink-0 flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div>
              <img
                src={book.imageSrc || defaultImage}
                className="h-78 w-64 rounded-xl object-cover shadow-md"
              />
              <InputField
                label="Portada"
                id="imageSrc"
                type="text"
                required
                value={book.imageSrc}
                onChange={(e) => updateBook("imageSrc", e.target.value)}
              />
              <ValidationField field="imageSrc" errors={errors} />
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-4">
            <div className="gap-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-l border-b border-gray-100 font-bold text-gray-900">
                Detalles del Libro
              </h2>
              <div>
                <InputField
                  label="Titulo"
                  id="title"
                  type="text"
                  required
                  value={book.title}
                  onChange={(e) => updateBook("title", e.target.value)}
                />
                <ValidationField field="title" errors={errors} />
                <GenericCombobox
                  options={Object.values(BookType)}
                  value={book.bookType}
                  onChange={(v: BookType | null) => updateBook("bookType", v)}
                  placeholder="Buscar tipo..."
                  label="Tipo"
                  getLabel={(v) => BookTypeLabels[v]}
                  disabled={isEditing}
                />
              </div>
              {/* dos columnas   */}
              {/* fila 1 genero - autor   */}
              <div className="grid grid-cols-6 gap-4 py-2">
                <div className="col-start-1 col-end-4">
                  <span>
                    <div>
                      <GenericCombobox
                        options={Object.values(BookGender)}
                        value={book.gender}
                        onChange={(v: BookGender | null) =>
                          updateBook("gender", v)
                        }
                        placeholder="Buscar género..."
                        label="Género"
                      />
                    </div>
                  </span>
                </div>
                <div className="col-start-4 col-end-7">
                  <span>
                    <div>
                      <InputField
                        label="Autor"
                        id="author"
                        type="text"
                        required
                        value={book.author.name}
                        onChange={(e) =>
                          updateBook(
                            "author",
                            new Author(0, e.target.value, book.author.avatar),
                          )
                        }
                      />
                      <ValidationField field="author" errors={errors} />
                    </div>
                  </span>
                </div>
              </div>
              {/* fin fila */}
              {/* fila 2 idioma - estado   */}
              <div className="grid grid-cols-6 gap-4 py-2">
                <div className="col-start-1 col-end-4">
                  <span>
                    <div>
                      <GenericCombobox
                        options={Object.values(Languages)}
                        value={book.language}
                        onChange={(v: Languages | null) =>
                          updateBook("language", v)
                        }
                        placeholder="Buscar Idioma..."
                        label="Idioma"
                      />
                    </div>
                  </span>
                </div>
                <div className="col-start-4 col-end-7">
                  <span>
                    <div>
                      <GenericCombobox
                        options={Object.values(BookCondition)}
                        value={book.condition}
                        onChange={(v: BookCondition | null) =>
                          updateBook("condition", v)
                        }
                        placeholder="Seleccionar Estado"
                        label="Estado"
                      />
                    </div>
                  </span>
                </div>
              </div>
              {/* fin fila */}
              {/* fila 2 editorial - fecha de publicacion   */}
              <div className="grid grid-cols-6 gap-4 py-2">
                <div className="col-start-1 col-end-4">
                  <span>
                    <div>
                      <InputField
                        label="Editorial"
                        id="editorial"
                        type="text"
                        required
                        value={book.editorial}
                        onChange={(e) =>
                          updateBook("editorial", e.target.value)
                        }
                      />
                      <ValidationField field="editorial" errors={errors} />
                    </div>
                  </span>
                </div>
                <div className="col-start-4 col-end-7">
                  <span>
                    <div>
                      <InputField
                        label="Fecha de publicacion"
                        id="publishDate"
                        type="date"
                        required
                        value={
                          book.publishDate
                            ? new Date(
                                new Date(book.publishDate).getTime() +
                                  new Date(
                                    book.publishDate,
                                  ).getTimezoneOffset() *
                                    60000,
                              )
                                .toISOString()
                                .split("T")[0]
                            : ""
                        }
                        onChange={(e) => {
                          const raw = e.target.value // "2024-03-25"
                          if (!raw) {
                            updateBook("publishDate", null)
                            return
                          }
                          const [year, month, day] = raw.split("-").map(Number)
                          if (year < 1000) return
                          //en javascript/typescript los meses van de 0 a 11 rarooo
                          //"2024-01-25"  → month = 1  → 1 - 1 = 0   Enero en JS
                          //"2024-12-25"  → month = 12 → 12 - 1 = 11  Diciembre en JS
                          const date = new Date(year, month - 1, day)
                          updateBook("publishDate", date)
                        }}
                      />

                      <ValidationField field="publishDate" errors={errors} />
                    </div>
                  </span>
                </div>
              </div>
              {/* fin fila */}
              {/* fila 3 cantidad de paginas - ISBN   */}
              <div className="grid grid-cols-6 gap-4 py-2">
                <div className="col-start-1 col-end-4">
                  <span>
                    <div>
                      <InputField
                        label="Cantidad de páginas"
                        id="pages"
                        type="text"
                        required
                        value={book.numPages}
                        onChange={(e) => updateBook("numPages", e.target.value)}
                      />
                      <ValidationField field="numPages" errors={errors} />
                    </div>
                  </span>
                </div>
                <div className="col-start-4 col-end-7">
                  <span>
                    <div>
                      <InputField
                        label="ISBN"
                        id="ISBN"
                        type="text"
                        required
                        value={book.isbn}
                        onChange={(e) => updateBook("isbn", e.target.value)}
                      />
                      <ValidationField field="isbn" errors={errors} />
                    </div>
                  </span>
                </div>
              </div>
              {/* fin fila */}
              <div>
                <TextareaField
                  label="Descripcion"
                  id="desc"
                  type="text"
                  value={book.desc}
                  maxLength={1000}
                  rows={10}
                  placeholder="Ingrese aqui la descripcion del libro"
                  onChange={(e) => updateBook("desc", e.target.value)}
                />
                <ValidationField field="desc" errors={errors} />
              </div>
              <div>
                <span style={{ marginRight: 5 }}>
                  <Button
                    onClick={handleSubmit}
                    className="mt-4 inline-block rounded-xl bg-blue-500 px-6 py-2.5 text-sm font-semibold text-white transition-all duration-150 ease-out hover:scale-[1.08] hover:bg-blue-600"
                  >
                    {isEditing ? "Guardar cambios" : "Crear"}
                  </Button>
                </span>
                <span style={{ marginLeft: 5 }}>
                  <Button
                    onClick={() => navigate(-1)}
                    className="mt-4 inline-block rounded-xl bg-blue-300 px-6 py-2.5 text-sm font-semibold text-white transition-all duration-150 ease-out hover:scale-[1.08] hover:bg-blue-600"
                  >
                    {isEditing ? "Descartar cambios" : "Descartar"}
                  </Button>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
