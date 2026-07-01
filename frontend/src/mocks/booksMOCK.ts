import { Book } from "@/domain/book"
import { BookReview } from "@/domain/review"
import { UserProfile } from "@/domain/userProfile"
import { BookCondition } from "@/types/bookCondition"
import { BookGender } from "@/types/bookGender"
import { BookType } from "@/types/bookType"
import { Languages } from "@/types/languages"
import BookAvatar from "../assets/Scott Fitzgerald.jpg"
import { Author } from "@/domain/author"
import { UserType } from "@/domain/user"

// const reviewOne : BookReview = new BookReview(4)
const reviewTwo: BookReview = new BookReview(5)
const reviewThree: BookReview = new BookReview(5)
const reviewOne: BookReview = new BookReview(
  5,
  5,
  "Muy buen libro, me encantó, recomiendo",
  "Jorge",
)
const maria = new UserProfile(
  1,
  "maria",
  "lectora",
  "asd",
  "asd",
  "0001-01-01",
  "1",
  "holis",
  "123",
)
const ana = new UserProfile(
  2,
  "ana",
  "lectora",
  "asd",
  "asd",
  "0001-01-01",
  "1",
  "holis",
  "123",
  "common",
)
const juan = new UserProfile(
  3,
  "juan",
  "lectora",
  "asd",
  "asd",
  "0001-01-01",
  "1",
  "holis",
  "123",
  "common",
)

const author = new Author(0, "F. Scott Fitzgerald", BookAvatar)

// export const bookOne: Book = new Book(
//   /* id: */ 1,
//   /* title: */ "La Biblioteca de la Medianoche",
//   /* bookType: */ BookType.Common,
//   /* desc: */ "El Gran Gatsby es una novela de 1925 del escritor estadounidense F. Scott Fitzgerald. Ambientada en la Era del Jazz en Long Island, cerca de la ciudad de Nueva York, la novela describe las interacciones del narrador en primera persona Nick Carraway con el misterioso millonario Jay Gatsby y la obsesión de Gatsby por reunirse con su antigua amante, Daisy Buchanan. La novela se inspiró en un romance juvenil que Fitzgerald tuvo con una socialité, y en las fiestas a las que asistió en la costa norte de Long Island en 1922. Tras mudarse a la Riviera francesa, completó un primer borrador en 1924",
//   /* gender: */ BookGender.SCIENCE_FICTION,
//   /* author: */ author,
//   /* pages: */ 288,
//   /* ISBN: */ "9780525559474",
//   /* language: */ Languages.SPANISH,
//   /* editorial: */ "Penguin",
//   /* publishDate: */ new Date(2020, 8, 13),
//   /* condition: */ BookCondition.GOOD,
//   /* reviews: */ [reviewOne, reviewTwo, reviewThree],
//   /* imageSrc: */ "https://perireads.com/wp-content/uploads/2021/12/The-Midnight-Library-Feature.jpg",
//   /* owner: */ maria,
// )

// const bookTwo: Book = new Book(
//   /* id: */ 2,
//   /* title: */ "Una Educación",
//   /* bookType: */ BookType.WithADedication,
//   /* desc: */ "",
//   /* gender: */ BookGender.CLASSIC_LITERATURE,
//   /* author: */ author,
//   /* pages: */ 500,
//   /* ISBN: */ "9780525559474",
//   /* language: */ Languages.ENGLISH,
//   /* editorial: */ "Penguin",
//   /* publishDate: */ new Date(2020, 8, 13),
//   /* condition: */ BookCondition.BAD,
//   /* reviews: */ [reviewOne, reviewTwo, reviewThree],
//   /* imageSrc: */ "https://http2.mlstatic.com/D_NQ_NP_749866-CBT75839432672_042024-O.webp",
//   /* owner: */ new UserProfile("Paula"),
// )

// const bookThree: Book = new Book(
//   /* id: */ 3,
//   /* title: */ "Duna",
//   /* bookType: */ BookType.Collectible,
//   /* desc: */ "",
//   /* gender: */ BookGender.DRAMA,
//   /* author: */ author,
//   /* pages: */ 1200,
//   /* ISBN: */ "9780525559474",
//   /* language: */ Languages.PORTUGUESE,
//   /* editorial: */ "Penguin",
//   /* publishDate: */ new Date(2020, 8, 13),
//   /* condition: */ BookCondition.EXCELLENT,
//   /* reviews: */ [reviewOne, reviewTwo, reviewThree],
//   /* imageSrc: */ "https://cdn.livriz.com/media/mediaspace/F9AFB48D-741D-4834-B760-F59344EEFF34/45/77621296-69ba-4513-acfc-5c6513bc7c67/mediamodifierc58cc803e01.webp",
//   /* owner: */ new UserProfile("Francisco"),
// )

// const bookFour: Book = new Book(
//   /* id: */ 4,
//   /* title: */ "Gente Normal",
//   /* bookType: */ BookType.Common,
//   /* desc: */ "",
//   /* gender: */ BookGender.Romance,
//   /* author: */ author,
//   /* pages: */ 1500,
//   /* ISBN: */ "9780525559474",
//   /* language: */ Languages.Spanish,
//   /* editorial: */ "Penguin",
//   /* publishDate: */ new Date(2020, 8, 13),
//   /* condition: */ BookCondition.Excellent,
//   /* reviews: */ [reviewOne, reviewTwo, reviewThree],
//   /* imageSrc: */ "https://sbslibreria.vtexassets.com/arquivos/ids/5074134-800-450?v=638854331913070000&width=800&height=450&aspect=true",
//   /* owner: */ new UserProfile("Augusto"),
// )

export const bookOne: Book = new Book(
  2,
  "La Biblioteca de la Medianoche",
  BookType.WithADedication,
  "El Gran Gatsby es una novela de 1925 del escritor estadounidense F. Scott Fitzgerald. Ambientada en la Era del Jazz en Long Island, cerca de la ciudad de Nueva York",
  BookGender.CLASSIC_LITERATURE,
  author,
  500,
  "9780525559474",
  Languages.ENGLISH,
  "Penguin",
  new Date(2020, 8, 13),
  BookCondition.BAD,
  "https://http2.mlstatic.com/D_NQ_NP_749866-CBT75839432672_042024-O.webp",
  new UserProfile(2, "Paula"),
)

const bookTwo: Book = new Book(
  2,
  "Una Educación",
  BookType.WithADedication,
  "El narrador moja una magdalena en una taza de té y, con ese gesto involuntario, el pasado entero regresa con una vividez abrumadora. Así comienza el primer volumen de En busca del tiempo perdido, la obra monumental de Marcel Proust.",
  BookGender.CLASSIC_LITERATURE,
  author,
  500,
  "9780525559474",
  Languages.ENGLISH,
  "Penguin",
  new Date(2020, 8, 13),
  BookCondition.BAD,
  "https://http2.mlstatic.com/D_NQ_NP_749866-CBT75839432672_042024-O.webp",
  new UserProfile(2, "Paula"),
)

const bookThree: Book = new Book(
  3,
  "Duna",
  BookType.Collectible,
  "Liubov Ranevskaya regresa a Rusia después de años en Francia, donde huyó tras una serie de tragedias personales. La espera en su hacienda familiar, con su magnífico jardín de cerezos en flor, no puede durar: las deudas son insostenibles y la propiedad debe venderse.",
  BookGender.DRAMA,
  author,
  1200,
  "9780525559474",
  Languages.PORTUGUESE,
  "Penguin",
  new Date(2020, 8, 13),
  BookCondition.EXCELLENT,
  "https://cdn.livriz.com/media/mediaspace/F9AFB48D-741D-4834-B760-F59344EEFF34/45/77621296-69ba-4513-acfc-5c6513bc7c67/mediamodifierc58cc803e01.webp",
  new UserProfile(3, "Francisco"),
)

const bookFour: Book = new Book(
  4,
  "Gente Normal",
  BookType.Common,
  "Harry Potter tiene once años y vive en un armario debajo de la escalera de la casa de sus tíos, quienes lo tratan como un estorbo y le ocultan un secreto fundamental: que sus padres no murieron en un accidente de tráfico, sino a manos del mago más oscuro que el mundo mágico haya conocido, y que Harry, de algún modo inexplicable, sobrevivió a ese ataque siendo un bebé. Cuando las cartas de Hogwarts comienzan a llegar, se abre una puerta a un mundo paralelo de hechizos, varitas, fantasmas",
  BookGender.ROMANCE,
  author,
  1500,
  "9780525559474",
  Languages.SPANISH,
  "Penguin",
  new Date(2020, 8, 13),
  BookCondition.EXCELLENT,
  "https://sbslibreria.vtexassets.com/arquivos/ids/5074134-800-450?v=638854331913070000&width=800&height=450&aspect=true",
  new UserProfile(4, "Augusto"),
)

export const booksMOCK: Book[] = [bookOne, bookTwo, bookThree, bookFour]
