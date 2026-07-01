import { PrivateLayer } from '@/components/PrivateLayer'
import { PublisherLayer } from '@/layouts/PublisherLayer'
import { useAuth } from '@/context/AuthContext'
import { useUserProfile } from '@/context/UserProfileContext'
import { useUserData } from '@/hooks/UseUserData'
import BookDetail from '@/pages/BookDetail'
import ControlPanel from '@/pages/ControlPanel'
import EditBook from '@/pages/EditBook'
import Home from '@/pages/Home'
import LoanDetails from '@/pages/LoanDetails'
import { Login } from '@/pages/Login'
import NotFound from '@/pages/NotFound'
import Profile from '@/pages/Profile'
import { Register } from '@/pages/Register'
import { useEffect, useMemo } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import { AdminLayer } from '@/layouts/AdminLayer'

const AppRouter = () => {
    const { user, isInitializing } = useAuth()
  const { userProfile, refreshProfile } = useUserProfile()
  const { isPublisher, isAdmin } = useUserData()

  useEffect(() => {
    if (user && !isInitializing) refreshProfile()
  }, [user, isInitializing])

  const publisherRedirect = useMemo(() => isPublisher(), [userProfile, user])

  if (isInitializing) return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
        <p className="animate-spin h-8 w-8 text-muted-foreground"> CARGANDOOOO </p>
    </div>
    )

  return (
    <Routes>
        {/* Rutas públicas - siempre disponibles */}
        <Route path="/login" element={user ? <Navigate to={isAdmin() ? "/dashboard" : "/"} replace /> : <Login />}/>
        <Route path="/registrarse" element={!user ? <Register /> : <Navigate to="/" replace />} />

        {/* Rutas privadas */}
        <Route element={<PrivateLayer />}>
          <Route path="/" element={isAdmin() ? <Navigate to="/dashboard" replace /> : publisherRedirect ? <Navigate to="/perfil" replace/> : <Home />} />
          <Route path="/detalle-de-libro/:id" element={<BookDetail />} />
          <Route path="/prestamos-de-libros" element={<LoanDetails />} />
          <Route path="/perfil" element={<Profile />} />
          <Route element={<PublisherLayer />}>
            <Route path="/editar-libro/:id" element={<EditBook />} />
            <Route path="/crear-libro" element={<EditBook />} />
          </Route>
          <Route element={<AdminLayer />}>
            <Route path="/dashboard" element={<ControlPanel />} />
          </Route>
        </Route>

        {/* Catch-all */}
        <Route path="*" element={user ? <NotFound /> : <Navigate to="/login" replace />} />
      </Routes>
  )
}

export default AppRouter