export type JwtHeader = {
  alg?: string
  typ?: string
}

export type JwtPayload = {
  sub?: string
  roles?: string[]
  role?: string[]
  exp?: number
  iat?: number
} & Record<string, unknown>

const textDecoder = new TextDecoder()

const decodeBase64Url = (value: string): string => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/")
  const padding = (4 - (normalized.length % 4)) % 4
  const binary = atob(normalized.padEnd(normalized.length + padding, "="))
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
  return textDecoder.decode(bytes)
}

const parseJwtPart = <T>(token: string, index: 0 | 1): T | null => {
  try {
    const part = token.split(".")[index]
    if (!part) return null
    const parsed: unknown = JSON.parse(decodeBase64Url(part))
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
      return null
    return parsed as T
  } catch {
    return null
  }
}

export const getTokenPayload = (token: string | null): JwtPayload | null => {
  if (!token) return null
  return parseJwtPart<JwtPayload>(token, 1)
}

export const getTokenHeader = (token: string | null): JwtHeader | null => {
  if (!token) return null
  return parseJwtPart<JwtHeader>(token, 0)
}
