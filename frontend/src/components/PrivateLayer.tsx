import { Outlet, Navigate } from "react-router"
import NavBar from "./NavBar"
import { useAuth } from "@/context/AuthContext"

export const PrivateLayer = () => {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />

  return (
    <div>
      <NavBar />
      <main>
        <Outlet />
      </main>
    </div>
  )
}
