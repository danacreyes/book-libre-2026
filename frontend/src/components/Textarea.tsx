import { useState, useEffect } from "react"

interface TextareaFieldProps {
    label: string;
    id: string;
    maxLength?: number;
    type:String;
    labelClassName?: string;
    className?: string;
}

export const TextareaField = ({
    label,
    id,
    maxLength,
    labelClassName = "block text-sm font-medium text-gray-700",
    className = "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none",
    ...rest
}: TextareaFieldProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>) => {
    const [count, setCount] = useState(
        typeof rest.value === 'string' ? rest.value.length : 0
    )

    useEffect(() => {
        if (typeof rest.value === 'string') {
            setCount(rest.value.length)
        }
    }, [rest.value])  // ← cuando llegue el valor del back, actualiza el contador

    return (
        <div>
            <label htmlFor={id} className={labelClassName}>
                {label}
            </label>
            <textarea
                id={id}
                className={className}
                maxLength={maxLength}
                onChange={(e) => {
                    setCount(e.target.value.length)
                    rest.onChange?.(e)
                }}
                {...rest}
            />
            {maxLength && (
                <p className="text-right text-sm text-gray-400 mt-1">
                    {count}/{maxLength}
                </p>
            )}
        </div>
    )
}