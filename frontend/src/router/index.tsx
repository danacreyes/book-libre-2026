import { createBrowserRouter } from "react-router"
import RootLayout from "@/layouts/RootLayout"
import LoanDetails from "@/pages/LoanDetails"
import NotFound from "@/pages/NotFound"
import BookDetail from "@/pages/BookDetail"
import Profile from "@/pages/Profile"
import Home from "@/pages/Home"
import App from "@/App"
import AuthLayout from "@/layouts/AuthLayout"
import EditBook from "@/pages/EditBook"


export const router = createBrowserRouter([
  {
    // Aunque los dos grupos tienen (path: "/") como padre, React Router busca la coincidencia mas especifica en los children
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      // rutas hijas dentro de el outlet
      { index: true, element: <App /> }, // index es la ruta por defecto
      { path: "home", element: <Home /> }, // luego será el index esta
      { path: "prestamos-de-libros", element: <LoanDetails /> },
      { path: "detalle-de-libro/:id", element: <BookDetail /> },
      { path: "perfil", element: <Profile /> },
      { path: "edicion-de-libro", element: <EditBook /> },
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      // { path: "login", element: <Login /> },
      // { path: "register", element: <Register /> },
    ],
  },
])
