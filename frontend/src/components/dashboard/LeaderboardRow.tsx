import Avatar from "./Avatar"

type Props = {
  rank: number
  name: string
  img: string
  value: number
}

const rankColor = (rank: number): string => {
  if (rank === 1) return "text-amber-500"
  if (rank === 2) return "text-gray-600"
  if (rank === 3) return "text-amber-700"
  return "text-gray-300"
}

export default function LeaderboardRow({ rank, name, img, value }: Props) {
  return (
    <div className="flex items-center gap-3">
      <span className={`w-4 text-sm font-bold ${rankColor(rank)}`}>{rank}</span>
      <Avatar src={img} name={name} size={32} />
      <span className="flex-1 text-sm font-semibold text-gray-900">{name}</span>
      <span className="text-sm font-bold text-gray-900">
        {value.toLocaleString("es-AR")}
      </span>
    </div>
  )
}
