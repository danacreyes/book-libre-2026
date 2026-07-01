import SessionExpiredModal from "@/components/SessionExpiredModal"
import { createContext, useContext, useEffect, useRef, useState } from "react"
import { useOnInit } from "@/hooks/UseOnInit"
import { tokenMemory, tokenService } from "@/services/tokenService"

export interface AuthUser {
  id: string //cambio por nuevo id UUID
  accessToken: string
  refreshToken: string
  sessionExpiresAt: number
}
interface AuthContextType {
  user: Omit<AuthUser, 'accessToken'> | null
  login: (userData: Omit<AuthUser, 'accessToken'>, token: string, expirationTime: number, rememberMe?: boolean) => void
  logout: () => void
  isInitializing: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export const getId = (): string | null => {
  try {
    const stored = localStorage.getItem("user") || sessionStorage.getItem("user")
    return stored ? (JSON.parse(stored) as Omit<AuthUser, 'accessToken'>).id : null
  } catch {
    localStorage.removeItem("user")
    sessionStorage.removeItem("user")
    return null
  }
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Omit<AuthUser, 'accessToken'> | null>(() => {
    // Solo cargás el user sin el token
    try {
      const stored = localStorage.getItem("user") || sessionStorage.getItem("user")
      return stored ? JSON.parse(stored) : null
    } catch { return null }
  })
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [sessionExpiredModal, setSessionExpiredModal] = useState(false)

  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [isInitializing, setIsInitializing] = useState(true) // evita render prematuro

  const login = (userData: Omit<AuthUser, 'accessToken'>, token: string, expirationTime: number, rememberMe = false) => {
    const storage = rememberMe ? localStorage : sessionStorage
    const sessionExpiresAt = Date.now() + expirationTime
    storage.setItem("user", JSON.stringify({ ...userData, sessionExpiresAt, sessionDuration: expirationTime }))
    setUser({ ...userData, sessionExpiresAt })
    tokenMemory.set(token)
    setAccessToken(token)
  }
  
  const logout = () => {
    localStorage.removeItem("user")
    sessionStorage.removeItem("user")
    setUser(null)
    setAccessToken(null)
  }

  const handleSessionExpired = () => {
    // console.log("Ejecutando timeout...")
    setSessionExpiredModal(false)
    logout()
    sessionStorage.setItem("sessionExpiredMessage", "Tu sesión expiró")
  }

  // Callback que se llama cada vez que se hace el refresh del token
  const renewSession = () => {
    const storage = localStorage.getItem("user") ? localStorage : sessionStorage
    const rawUser = storage.getItem("user")
    if (!rawUser) return
    try {
      const stored = JSON.parse(rawUser)
      const duration = stored.sessionDuration
      if (!duration) return
      const sessionExpiresAt = Date.now() + duration
      stored.sessionExpiresAt = sessionExpiresAt // nuevo expiry
      storage.setItem("user", JSON.stringify(stored)) // guardo en storage
      setUser(prev => prev ? { ...prev, sessionExpiresAt } : prev) // modifico el user y el timeout se lanza denuevo
    } catch {
      /* si el storage está corrupto, lo más seguro es limpiar la sesión (hacer logout), porque el dato del usuario ya no es confiable */ 
      console.log("Error al renovar sesión: datos de usuario corruptos en storage, limpiando.")
      logout()
    }
  }

  useEffect(() => {
    tokenService.setOnRefresh(renewSession)
    return () => { tokenService.setOnRefresh(null) }
  }, [])
  
  useEffect(() => {
    // console.log("Hubo un cambio en user")
    if (!user) return

    const sessionExpiresAt = (user as any).sessionExpiresAt
    if (!sessionExpiresAt) return

    const msUntilExpiry = sessionExpiresAt - Date.now()

    if (msUntilExpiry <= 0) {
      // Ya expiró (ej: el usuario volvió después de mucho tiempo)
      handleSessionExpired()
      return
    }

    timerRef.current = setTimeout(() => {setSessionExpiredModal(true)}, msUntilExpiry)

    // Cleanup: evita timers duplicados si user cambia
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [user])

  // Visibilitychange: cubre tabs en background o congeladas
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState !== "visible" || !user) return

      const sessionExpiresAt = (user as any).sessionExpiresAt
      if (sessionExpiresAt && Date.now() >= sessionExpiresAt) {
        setSessionExpiredModal(true)
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [user])

  // sincronizo el estado con tokenMemory ref
  useEffect(() => {
    tokenMemory.set(accessToken)
  }, [accessToken])

  // ref para que no se mande dos veces el refresh al iniciar (strict mode de React)
  const didRefresh = useRef(false)
  useOnInit(() => {
    if (didRefresh.current) return
    didRefresh.current = true

    if (!user) {
      setIsInitializing(false)
      return
    }

    tokenService.refreshAccessToken()
      .then((newToken) => {
        console.log("Refresh inicial exitoso, sesión válida.")
        setAccessToken(newToken)
      })
      .catch(() => {
        console.log("Refresh inicial falló, cerrando sesión.")
        logout()
      })
      .finally(() => {
        setIsInitializing(false)
      })
  })

  return (
    <AuthContext.Provider value={{ user, login, logout, isInitializing }}>
      {children}

      {sessionExpiredModal && (
        <SessionExpiredModal onClick={handleSessionExpired}/>
      )}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider")
  return context
}