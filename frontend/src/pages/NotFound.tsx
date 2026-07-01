import { Link } from "react-router"

export default function NotFound() {
  // const error = useRouteError() // esto es un hook que agarra el error que tiro React Router

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">
        Mmm la ruta que estas buscando no existe
      </h1>
      <p className="text-gray-500">
        Parece que te perdiste...
      </p>
      <img
        src="/assets/john-travolta-lost.gif"
        alt="John Travolta perdido"
        className="w-250 rounded-lg"
      />
      <Link to="/" className="text-blue-500 underline">
        Volver al inicio
      </Link>
    </div>
  )
}
