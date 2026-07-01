import { createContext, useContext, useState, useCallback } from "react"
import { UserProfile } from "@/domain/userProfile"
import { userProfileService } from "@/services/userProfileService"
import { showToast } from "@/utils/toast"

interface UserProfileContextType {
  userProfile: UserProfile
  refreshProfile: () => Promise<void>
}

const UserProfileContext = createContext<UserProfileContextType | null>(null)

export const UserProfileProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [userProfile, setUserProfile] = useState<UserProfile>(new UserProfile())

  const refreshProfile = useCallback(async () => {
    try {
      const profile = await userProfileService.getProfile()
      setUserProfile(profile)
    } catch (error) {
      showToast.httpError(error, "Error al cargar el perfil de usuario: ")
    }
  }, [])

  return (
    <UserProfileContext.Provider value={{ userProfile, refreshProfile }}>
      {children}
    </UserProfileContext.Provider>
  )
}

export const useUserProfile = () => {
  const context = useContext(UserProfileContext)
  if (!context)
    throw new Error("useUserProfile must be used within UserProfileProvider")
  return context
}
