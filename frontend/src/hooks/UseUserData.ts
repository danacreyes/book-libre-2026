import { tokenMemory } from "@/services/tokenService"
import { UserKind } from "@/types/userKind"
import { getTokenPayload } from "@/utils/jwt"

const ROLE_MAP: Record<string, UserKind> = {
  PUBLISHER: UserKind.PUBLISHER,
  READER:    UserKind.READER,
  COMBINED:  UserKind.COMBINED,
  ADMIN:     UserKind.ADMIN,
}

export function useUserData() {
  const getRole = (): UserKind | null => {
    const token = tokenMemory.get()
    // console.log("token:", token)
    const payload = getTokenPayload(token)
    // console.log("payload:", payload)
    const raw = (payload?.role?.[0] ?? payload?.roles?.[0])?.replace("ROLE_", "")
    return raw ? ROLE_MAP[raw] ?? null : null
  }

  const isCombined = () => 
    getRole() === UserKind.COMBINED

  const isPublisher = () =>
    getRole() === UserKind.PUBLISHER

  const isReader = () =>
    getRole() === UserKind.READER

  const isAdmin = () =>
    getRole() === UserKind.ADMIN

  return { getRole, isPublisher, isReader, isCombined, isAdmin }
}