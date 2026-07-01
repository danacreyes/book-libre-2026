import { Outlet, Navigate } from "react-router"
import { useUserData } from "@/hooks/UseUserData"

export const AdminLayer = () => {
  const { isAdmin } = useUserData()

  if (!isAdmin()) return <Navigate to="/" replace />

  return <Outlet />
}
