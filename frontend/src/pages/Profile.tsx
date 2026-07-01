import { useOnInit } from "@/hooks/UseOnInit"
import { UserProfile } from "@/domain/userProfile"
import { userProfileService } from "@/services/userProfileService"
import { useState } from "react"

import {
  UserCircleIcon,
  CalendarBlankIcon,
  MapPinIcon,
  ChartLineIcon,
} from "@phosphor-icons/react"

// import { getErrorMessage } from "@/validation/errorHandler"
import { reserveService } from "@/services/reserveService"
import ProfileSettingsModal from "@/components/ProfileSettingsModal"
import { showToast } from "@/utils/toast"
import { useLocation, useNavigate } from "react-router"
import ProfileBookList from "@/components/ProfileBookList"
import { UserKind } from "@/types/userKind"

export type ProfilePageable = {
  filterCriteria: string,
  sortCriteria: string,
  page: number,
  pageSize: number
}

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile>(new UserProfile())
  const [userReadBooksNumber, setUserReadBooksNumber] = useState<number>(0)
  const [userLentBooksNumber, setUserLentBooksNumber] = useState<number>(0)
  const location = useLocation()
  const navigate = useNavigate()

  const getUser = async () => {
    try {
      const userProfile = await userProfileService.getProfile()
      setProfile(userProfile)
    } catch (error) {
      showToast.httpError(error, "Error al traer su usuario")
    }
  }

  const getUserReadBooksNumber = async () => {
    try {
      const userReadBooksNumber = await reserveService.getUserReadBooksNumber()
      setUserReadBooksNumber(userReadBooksNumber)
    } catch (error) {
      showToast.httpError(error, "Error al contar sus libros leidos")
    }
  }

  const getUserLentBooksNumber = async () => {
    try {
      const userLentBooksNumber = await reserveService.getUserLentBooksNumber()
      setUserLentBooksNumber(userLentBooksNumber)
    } catch (error) {
      showToast.httpError(error, "Error al contar sus libros prestados")
    }
  }

  const handleProfileLoad = async () => {
    getUser()
    getUserReadBooksNumber()
    getUserLentBooksNumber()
  }

  useOnInit(() => {
    handleProfileLoad()
    if(location.state?.refreshBooks) {
      navigate(location.pathname, { replace: true, state: {} })
    }
  })

  return (
    <div className="flex min-h-screen justify-center bg-gray-100 pt-12">
      <section className="flex w-245 flex-col gap-7">
        <section className="col-span-3 flex h-42 items-center gap-4 rounded-xl border border-gray-200 bg-white p-4">
          <img
            src={
              profile.img
                ? `${import.meta.env.VITE_API_URL}${profile.img}`
                : "/assets/default-img.png"
            }
            alt="Profile Image"
            className="h-26 w-26 rounded-full object-cover"
          />
          <div className="flex flex-1 flex-col gap-3">
            <p className="text-3xl font-bold">{profile.name}</p>
            <p className="text-blue-400">{profile.description}</p>
            <div className="flex gap-1 text-sm text-gray-400">
              <p>
                <CalendarBlankIcon size={15} className="inline" /> Se unio en
                {" " +
                  (profile.timestamp
                    ? profile.timestamp.slice(6)
                    : new Date().getFullYear())}{" "}
                ·
              </p>
              <p>
                <MapPinIcon size={15} className="inline" />{" "}
                {profile.location + " "}·
              </p>
              <p>
                <ChartLineIcon size={15} className="inline" /> Bibliokarmas
                {" " + profile.bibliokarmas}
              </p>
            </div>
          </div>
          <ProfileSettingsModal
            profile={profile}
            onProfileUpdated={setProfile}
          />
        </section>

        <section className="flex gap-7">
          <div className="flex w-2/7 flex-col gap-14">
            <section className="flex h-74 flex-col gap-6 rounded-xl border border-gray-200 bg-white p-5">
              <article className="flex items-center gap-1">
                <UserCircleIcon size={25} />
                <p className="text-xl font-bold">Mis Datos</p>
              </article>
              <article className="border-b-2 border-gray-300 pb-2">
                <p className="text-xs font-bold text-gray-500">EMAIL</p>
                <p className="truncate" title={profile.email}>
                  {profile.email}
                </p>
              </article>
              <article className="border-b-2 border-gray-300 pb-2">
                <p className="text-xs font-bold text-gray-500">TELÉFONO</p>
                <p>
                  {profile.cel
                    ? "+54" +
                      " (" +
                      profile.cel.slice(0, 2) +
                      ") " +
                      profile.cel.slice(2)
                    : "Aun no registrado"}
                </p>
              </article>
              <article>
                <p className="text-xs font-bold text-gray-500">
                  TIPO DE PERFIL
                </p>
                <p>{profile.userType}</p>
              </article>
            </section>

            <section className="flex h-42 items-center justify-center gap-4 rounded-xl border border-gray-200 bg-red-100 p-5">
              {profile.userType !== UserKind.READER && (
                <article className="flex w-28 flex-col items-center gap-1 rounded-xl bg-gray-50 p-2">
                  <p className="text-xl font-extrabold text-gray-800">
                    {userLentBooksNumber}
                  </p>
                  <p className="text-center text-sm text-gray-500">
                    Libros Prestados
                  </p>
                </article>
              )}

              <article className="flex h-22 w-28 flex-col items-center justify-center gap-1 rounded-xl bg-gray-50 p-2">
                <p className="text-xl font-extrabold text-gray-800">
                  {userReadBooksNumber}
                </p>
                <p className="text-center text-sm text-gray-500">
                  Libros Leídos
                </p>
              </article>
            </section>
          </div>
          {profile.userType && <ProfileBookList key={profile.userType} userKind={profile.userType} />}
        </section>
      </section>
    </div>
  )
}
