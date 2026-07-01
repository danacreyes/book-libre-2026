type Props = {
  src: string
  name: string
  /** size in pixels */
  size?: number
  ringClassName?: string
}

const FALLBACK_IMG = "/assets/default-img.png"

export default function Avatar({ src, name, size = 36, ringClassName = "" }: Props) {
  return (
    <img
      src={src}
      alt={name}
      width={size}
      height={size}
      onError={(e) => {
        const target = e.currentTarget
        if (target.src.endsWith(FALLBACK_IMG)) return
        target.src = FALLBACK_IMG
      }}
      className={`rounded-full object-cover ring-2 ring-gray-100 ${ringClassName}`}
      style={{ width: size, height: size }}
    />
  )
}
