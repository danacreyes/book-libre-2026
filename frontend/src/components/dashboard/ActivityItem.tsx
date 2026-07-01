import { BookIcon, BookmarkSimpleIcon } from "@phosphor-icons/react"

export type Activity =
  | { type: "alta"; book: string; owner: string; time: string }
  | { type: "reserva"; text: string; time: string }

const iconConfig = {
  alta: {
    Icon: BookIcon,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  reserva: {
    Icon: BookmarkSimpleIcon,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
}

export default function ActivityItem({ activity }: { activity: Activity }) {
  const { Icon, color, bg } = iconConfig[activity.type]

  return (
    <div className="flex items-start gap-3">
      <span className={`flex items-center justify-center rounded-lg p-2 ${bg} ${color}`}>
        <Icon size={18} weight="regular" />
      </span>
      <div className="flex flex-col">
        {activity.type === "alta" ? (
          <>
            <span className="text-sm font-semibold text-gray-900">
              Alta de "{activity.book}"
            </span>
            <span className="text-xs text-gray-500">{activity.owner}</span>
            <span className="text-xs text-gray-400">{activity.time}</span>
          </>
        ) : (
          <>
            <span className="text-sm font-semibold text-gray-900">
              {activity.text}
            </span>
            <span className="text-xs text-gray-400">{activity.time}</span>
          </>
        )}
      </div>
    </div>
  )
}
