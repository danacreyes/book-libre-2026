import {
  type UserJSONRegisterRequest,
  type UserJSONResponse,
  UserType,
} from "@/domain/user"
import axios from "axios"

class UserService {
  async login(emailSent: string, passwordSent: string): Promise<UserJSONResponse> {
    const response = await axios.post<UserJSONResponse>(
        import.meta.env.VITE_API_URL + "/api/auth",
        { email: emailSent, password: passwordSent }
    )
    return response.data
}

  async createUser(user: UserType): Promise<void> {
    const userRegister: UserJSONRegisterRequest = {
      name: user.name,
      email: user.email,
      password: user.password,
      passwordRetry: "",
    }

    await axios.post<UserJSONResponse>(
      import.meta.env.VITE_API_URL + "/api/auth/register",
      userRegister,
    )
  }
}

export const userService = new UserService()
