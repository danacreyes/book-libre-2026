import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'

interface GenericComboboxProps<T extends string> {
  options: T[]
  value: T | null
  onChange: (value: T | null) => void
  placeholder?: string
  label?:string
  getLabel?: (value: T) => string
  disabled?: boolean
}

export function GenericCombobox<T extends string>({ options, value, onChange, placeholder = 'Buscar...', label, getLabel, disabled }: GenericComboboxProps<T>) {
  const [query, setQuery] = useState('')

  const filtered = query === ''
    ? options
    : options.filter(o => (getLabel ? getLabel(o) : o).toLowerCase().includes(query.toLowerCase()))


  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      )}
      <Combobox value={value} onChange={onChange}  disabled={disabled}>
        <div className="relative">
          <ComboboxInput
            placeholder={placeholder}
            displayValue={(v: T) => {
            return v ? (getLabel ? getLabel(v) : v) : ''
          }}

            onChange={(e) => setQuery(e.target.value)}
            
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm pr-8"
          />
          
          <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronDownIcon className="h-4 w-4 text-gray-400" />
          </ComboboxButton>
        </div>
        <ComboboxOptions className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg border border-gray-200">
          {filtered.map((option) => (
            <ComboboxOption
              key={option}
              value={option}
              className="cursor-pointer px-4 py-2 text-sm hover:bg-indigo-50 data-focus:bg-indigo-100"
            >
              {/* {option} */}
              {getLabel ? getLabel(option) : option}
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </Combobox>
    </div>
  )
}