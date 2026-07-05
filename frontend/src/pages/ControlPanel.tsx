import DashboardCard from "@/components/dashboard/DashboardCard"
import SegmentedBar, { type Segment } from "@/components/dashboard/SegmentedBar"
import ProgressRow from "@/components/dashboard/ProgressRow"
import LeaderboardRow from "@/components/dashboard/LeaderboardRow"
import ActivityItem, {
  type Activity,
} from "@/components/dashboard/ActivityItem"
import { useOnInit } from "@/hooks/UseOnInit"
import { graphqlService } from "@/services/graphql/graphqlService"
import { useState } from "react"
import type { BookConversion } from "@/domain/graphql/BookConversion"
import { showToast } from "@/utils/toast"
import type { BookTypeCalification } from "@/domain/graphql/BookTypeCalification"
import { BookTypeLabels } from "@/types/bookType"
import { timeAgo } from "@/utils/formatDate"

/* ===== Datos hardcodeados (sin services / endpoints por ahora) ===== */

const TOTAL_BOOKS = 200

const catalogStatus: Segment[] = [
  { label: "Prestados", value: 42, color: "bg-orange-500" },
  { label: "Nunca reservados", value: 88, color: "bg-neutral-500" },
  { label: "Reserva a futuro", value: 30, color: "bg-green-500" },
  { label: "Devueltos", value: 40, color: "bg-red-400" },
]

const conversionsBarColors = [
  { barColor: "bg-blue-800" },
  { barColor: "bg-blue-600" },
  { barColor: "bg-blue-500" },
  { barColor: "bg-cyan-500" },
  { barColor: "bg-cyan-400" },
]

const leaderboard = [
  {
    rank: 1,
    name: "Sofía M.",
    value: 1240,
    img: "https://i.pravatar.cc/150?img=47",
  },
  {
    rank: 2,
    name: "Mateo R.",
    value: 1180,
    img: "https://i.pravatar.cc/150?img=12",
  },
  {
    rank: 3,
    name: "Valentina G.",
    value: 1095,
    img: "https://i.pravatar.cc/150?img=45",
  },
  {
    rank: 4,
    name: "Lucas P.",
    value: 980,
    img: "https://i.pravatar.cc/150?img=33",
  },
  {
    rank: 5,
    name: "Camila T.",
    value: 870,
    img: "https://i.pravatar.cc/150?img=44",
  },
]

const MAX_SCORE = 5

export default function ControlPanel() {
  const [conversions, setConversions] = useState<BookConversion[]>([])
  const [maxRate, setMaxRate] = useState(0.0)
  const [calification, setCalification] = useState<BookTypeCalification[]>([])
  const [recentActivity, setRecentActivity] = useState<Activity[]>([])

  const getConversionRate = async () => {
    try {
      const response = await graphqlService.getConversionRate()
      setConversions(response)
      const rates = response.map((c) => c.conversionRate)
      const newMaxRate = rates.length ? Math.max(...rates) : 0
      setMaxRate(newMaxRate)
      // console.log(response)
      // console.log(newMaxRate)
    } catch (error) {
      showToast.httpError(error)
    }
  }

  const getBookTypeCalification = async () => {
    try {
      const response = await graphqlService.getCalificationAnalisis()
      setCalification(response)
    } catch (error) {
      showToast.httpError(error)
    }
  }

  const getRecentActivity = async () => {
    try {
      const events = await graphqlService.getRecentActivity()
      setRecentActivity(
        events.map((e): Activity => {
          const time = timeAgo(e.date)
          return e.__typename === "NewBookEvent"
            ? { type: "alta", book: e.bookTitle, owner: e.user, time }
            : {
                type: "reserva",
                text: `Reserva de ${e.bookTitle} · ${e.user}`,
                time,
              }
        }),
      )
    } catch (error) {
      showToast.httpError(error)
    }
  }

  useOnInit(() => {
    getConversionRate()
    getBookTypeCalification()
    getRecentActivity()
  })

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-4">
        {/* Estado del catálogo */}
        <DashboardCard
          title="Estado del catálogo"
          headerRight={
            <span>
              Total{" "}
              <span className="font-bold text-gray-900">{TOTAL_BOOKS}</span>
            </span>
          }
        >
          <SegmentedBar segments={catalogStatus} />
        </DashboardCard>

        {/* Grid de 2 columnas */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Tasa de conversión */}
          <DashboardCard title="Tasa de conversión">
            <div className="flex flex-col gap-5">
              {conversions.map((c, idx) => (
                <ProgressRow
                  key={c.title}
                  title={c.title}
                  subtitle={`${c.clicks} clicks · ${c.reservations} reservas`}
                  value={`${(c.conversionRate * 100).toPrecision(2)}%`}
                  progress={
                    maxRate > 0 ? (c.conversionRate / maxRate) * 100 : 0
                  }
                  barColor={conversionsBarColors[idx].barColor}
                />
              ))}
            </div>
          </DashboardCard>

          {/* Leaderboard */}
          <DashboardCard title="Leaderboard · bibliokarmas">
            <div className="flex flex-col gap-4">
              {leaderboard.map((person) => (
                <LeaderboardRow
                  key={person.rank}
                  rank={person.rank}
                  name={person.name}
                  img={person.img}
                  value={person.value}
                />
              ))}
            </div>
          </DashboardCard>

          {/* Calificación por tipo */}
          <DashboardCard title="Calificación por tipo">
            <div className="flex flex-col gap-5">
              {calification.map((bookTypeCalification) => (
                <ProgressRow
                  key={bookTypeCalification.bookType}
                  title={BookTypeLabels[bookTypeCalification.bookType]}
                  value={bookTypeCalification.avgRating.toFixed(2)}
                  progress={(bookTypeCalification.avgRating / MAX_SCORE) * 100}
                  barColor="bg-violet-400"
                />
              ))}
            </div>
            <p className="text-xs text-gray-400">
              Sobre 5 · excluye libros sin reseñas
            </p>
          </DashboardCard>

          {/* Actividad reciente */}
          <DashboardCard title="Actividad reciente">
            <div className="flex flex-col gap-4">
              {recentActivity.map((activity, i) => (
                <ActivityItem key={i} activity={activity} />
              ))}
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  )
}
