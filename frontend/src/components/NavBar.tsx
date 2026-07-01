import logo from "@/assets/logo.svg"
import { Link, useLocation, useSearchParams } from "react-router"
import { useAuth } from "@/context/AuthContext"
import { useNavigate } from "react-router"
import { useUserProfile } from "@/context/UserProfileContext"
import { UserKind } from "@/types/userKind"

const navigation = [
  { name: "Inicio", href: "/", current: true },
  { name: "Mis Préstamos", href: "/prestamos-de-libros", current: false },
  { name: "Perfil", href: "/perfil", current: false },
  { name: "Panel de Control", href: "/dashboard", current: false}
]

export default function NavBar() {
  const [searchParams] = useSearchParams() // home searchParams (para mantener filtros)
  const location = useLocation() // para mantener filtros al navegar
  const navigate = useNavigate()
  const { logout } = useAuth()
  // const [user, setUser] = useState<UserProfile>(new UserProfile())
  const { userProfile } = useUserProfile()

  const handleLogout = () => {
    logout()
    navigate("/login", { replace: true })
  }

  const isActive = (path: string) => location.pathname === path

  const isAdmin = () => userProfile.userType === UserKind.ADMIN

  const isHomeAndPublisher = (itemName: string) => {
    return itemName === "Inicio" && userProfile.userType === UserKind.PUBLISHER
  }

  const isDashboardAndNotAdmin = (itemName: string) => {
    return itemName === "Panel de Control" && userProfile.userType !== UserKind.ADMIN
  }

  const isBlockedForAdmin = (itemName: string) => {
    return isAdmin() && itemName !== "Panel de Control"
  }

  return (
    <nav className="border-b border-gray-100 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to={(userProfile.userType === UserKind.PUBLISHER || isAdmin()) ? "#" : `/?${searchParams.toString()}`}
            className={`flex items-center gap-2 ${(userProfile.userType === UserKind.PUBLISHER || isAdmin()) ? "cursor-default" : ""}`}
            onClick={(e) => (userProfile.userType === UserKind.PUBLISHER || isAdmin()) && e.preventDefault()}
          >
            <img src={logo} className="h-6 w-6" alt="Logo" />
            <span className="text-xl font-bold tracking-tight text-gray-900">
              Book<span className="font-extra-bold">Libre</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden sm:flex sm:items-center sm:space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.name == "Inicio" ? `/?${searchParams.toString()}` : item.href}
                className={`px-3 py-2 text-sm font-semibold transition-colors duration-150 ${
                  (isHomeAndPublisher(item.name) || isDashboardAndNotAdmin(item.name) || isBlockedForAdmin(item.name)) ? "hidden" : ""
                } ${
                  isActive(item.href)
                    ? "text-blue-500"
                    : "text-[#636F80] hover:text-gray-900"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right section */}
          <div className="flex items-center gap-4">
            {/* Bibliokarma */}
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <span className="font-semibold text-[#636F80]">
                Bibliokarma{" "}
                <span className="font-semibold">
                  {userProfile.bibliokarmas}
                </span>
              </span>
            </div>

            <Link to={isAdmin() ? "#" : "/perfil"} onClick={(e) => isAdmin() && e.preventDefault()}>
              <img
                alt="User avatar"
                src={
                  userProfile.img
                    ? `${import.meta.env.VITE_API_URL}${userProfile.img}`
                    : "/assets/default-img.png"
                }
                className="size-8 rounded-full object-cover ring-2 ring-gray-100"
              />
            </Link>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 rounded-md bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Salir
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
