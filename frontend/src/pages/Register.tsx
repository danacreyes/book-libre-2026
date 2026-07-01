import { Link, useNavigate, useLocation } from "react-router"
import type { UserJSONRegisterRequest } from "@/domain/user"
import { UserType } from "@/domain/user"
import { useState } from "react"
import { ValidationMessage } from "@/validation/validationMessage"
import ValidationField from "@/validation/ValidationField"
import { userService } from "@/services/UserService"
import { getErrorMessage } from "@/validation/errorHandler"
import { InputField } from "@/components/InputField"
import { showToast } from "@/utils/toast"
import { vi } from "vitest"
import VisibilityIcon from "@/components/VisibilityIcon"

export const Register = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState<UserJSONRegisterRequest>({
    name: "",
    email: "",
    password: "",
    passwordRetry: "",
  })
  const [errors, setErrors] = useState<Array<ValidationMessage>>([])
  const [visibilityType, setVisibilityType] = useState("password")

  const handleSubmit = async (ev: React.SubmitEvent<HTMLFormElement>) => {
    ev.preventDefault()

    const form = ev.currentTarget as HTMLFormElement

    const userRegister = new UserType(user.email, user.password, user.name)

    userRegister.validate()

    if (userRegister.errors.length > 0) {
      setErrors(userRegister.errors)
      return
    }

    if (user.password !== user.passwordRetry) {
      showToast.error("Las contraseñas no coinciden.")
      return
    }

    try {
      await userService.createUser(userRegister)
      showToast.success("Usuario generado con exito. Seras redirigido al login")
      setTimeout(() => {
        navigate("/login")
      }, 2000)
    } catch (error) {
      showToast.httpError(error, "Error al registrarse")
    } finally {
      setErrors([])
    }
  }

  const update = (clave: keyof typeof user, valor: unknown) => {
    setUser({
      ...user,
      [clave]: valor,
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex items-center justify-center" >
        <img
            src={"/logo.svg"
            }
            alt="logo booklibre"
            className="h-26 w-26  rounded-full object-cover"
          />
        </div>
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Book Libre</h1>
          <p className="mt-2 text-sm text-gray-600">
            Unete a nuestra comunidad y empieza a leer
          </p>
        </div>

        {/* Formulario */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Nombre completo */}
            <div>
              <InputField
                label="Nombre completo"
                id="name"
                type="text"
                required
                value={user.name}
                onChange={(e) => update("name", e.target.value)}
              />
              <ValidationField field="name" errors={errors} />
            </div>

            {/* Email Field */}
            <div>
              <InputField
                label="Correo Electronico"
                id="email"
                type="email"
                required
                value={user.email}
                onChange={(e) => update("email", e.target.value)}
              />
              <ValidationField field="email" errors={errors} />
            </div>

            {/* Password Field */}
            <div>
              <InputField
                label="Contraseña"
                id="password"
                type={visibilityType}
                required
                value={user.password}
                onChange={(e) => update("password", e.target.value)}
              />
              <VisibilityIcon visibilityTipe={visibilityType} setVisibilityTipe={setVisibilityType} />
              <ValidationField field="password" errors={errors} />
            </div>

            {/* Password retry */}
            <div>
              <InputField
                label="Confirmar contraseña"
                id="password-retry"
                type={visibilityType}
                required
                value={user.passwordRetry}
                onChange={(e) => update("passwordRetry", e.target.value)}
              />
              <VisibilityIcon visibilityTipe={visibilityType} setVisibilityTipe={setVisibilityType} />
              <ValidationField field="password" errors={errors} />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            {"Crear cuenta"}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-600">
          ¿Ya tienes cuenta?{" "}
          <Link
            to="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
