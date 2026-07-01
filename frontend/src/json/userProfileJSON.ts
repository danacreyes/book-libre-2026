import type { UserKind } from "@/types/userKind"

export type UserProfileJSON = {
  id: string //cambio por nuevo id UUID
  name: string
  description: string
  email: string
  cel: string
  location: string
  timestamp: string
  bibliokarmas: number
  userType: UserKind
  img: string
}

export type UserProfileUpdateJSON = {
  id: string //cambio por nuevo id UUID
  name: string
  description: string
  email: string
  img: string
  cel: string
  location: string
  timestamp: string
  bibliokarmas: number
  userType: UserKind
}
