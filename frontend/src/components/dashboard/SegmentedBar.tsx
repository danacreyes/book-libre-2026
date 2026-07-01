export type Segment = {
  label: string
  value: number
  color: string // tailwind bg-* class
}

type Props = {
  segments: Segment[]
}

export default function SegmentedBar({ segments }: Props) {
  const total = segments.reduce((acc, s) => acc + s.value, 0)

  return (
    <div className="flex flex-col gap-4">
      {/* Stacked bar */}
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-gray-200">
        {segments.map((segment) => (
          <div
            key={segment.label}
            className={segment.color}
            style={{ width: `${(segment.value / total) * 100}%` }}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-8 gap-y-3">
        {segments.map((segment) => (
          <div key={segment.label} className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className={`size-2.5 rounded-full ${segment.color}`} />
              <span className="text-xs text-gray-500">{segment.label}</span>
            </div>
            <span className="text-lg font-bold text-gray-900">
              {segment.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
