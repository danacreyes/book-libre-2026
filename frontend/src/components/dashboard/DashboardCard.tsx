import { type ReactNode } from "react"

type Props = {
  title: string
  headerRight?: ReactNode
  children: ReactNode
  className?: string
}

export default function DashboardCard({
  title,
  headerRight,
  children,
  className = "",
}: Props) {
  return (
    <section
      className={`flex flex-col gap-5 rounded-xl border border-gray-200 bg-white p-6 ${className}`}
    >
      <header className="flex items-center justify-between">
        <h2 className="text-sm font-bold tracking-wide text-gray-900">
          {title}
        </h2>
        {headerRight && <div className="text-sm text-gray-500">{headerRight}</div>}
      </header>
      {children}
    </section>
  )
}
