type Props = {
  title: string
  subtitle?: string
  value: string
  /** 0 - 100 */
  progress: number
  barColor: string // tailwind bg-* class
  valueClassName?: string
}

export default function ProgressRow({
  title,
  subtitle,
  value,
  progress,
  barColor,
}: Props) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-gray-900">{title}</span>
        <span className={`text-sm font-bold text-gray-500`}>{value}</span>
      </div>
      {subtitle && <span className="text-xs text-gray-500">{subtitle}</span>}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className={`h-full rounded-full ${barColor}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
