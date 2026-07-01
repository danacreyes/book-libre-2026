import { Outlet, Navigate } from "react-router"
import { useUserData } from "@/hooks/UseUserData"

export const PublisherLayer = () => {
  const { isPublisher, isCombined } = useUserData()

  if (!isPublisher() && !isCombined()) return <Navigate to="/" replace />

  return <Outlet />
}
