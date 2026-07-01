import { Outlet } from "react-router"
import Navbar from "@/components/NavBar"

export default function RootLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  )
}
