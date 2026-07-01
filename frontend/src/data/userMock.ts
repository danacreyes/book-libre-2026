import { type UserJSONLoginRequest } from "@/domain/user"

const USER1_MOCK: UserJSONLoginRequest = {
  mail: "juancarlos@hotmail.com",
  password: "112233",
}
const USER2_MOCK: UserJSONLoginRequest = {
  mail: "matiasgonzales@hotmail.com",
  password: "112233",
}

export const USERS_LIST_MOCK: UserJSONLoginRequest[] = [USER1_MOCK, USER2_MOCK]
