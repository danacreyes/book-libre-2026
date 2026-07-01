import { MenuItem } from "@headlessui/react";

// Esto le pone las clases a las opciones del Select de Ordenar por.
// Si está seleccionado, bold o no (active)
function classNames(...classes : string[]) {
  return classes.filter(Boolean).join(' ')
}

const SelectSorting = ({ option, onClick } : { option: any; onClick: (value: string) => void }) => {

  return (
    <MenuItem key={option.name}>
      <a
        onClick={() => {onClick(option.value)}}
        className={classNames(
          option.current ? 'font-medium text-gray-900' : 'text-gray-500',
          'block px-4 py-2 text-sm data-focus:bg-gray-100 data-focus:outline-hidden',
        )}
      >
        {option.name}
      </a>
    </MenuItem>
  )
}

export default SelectSorting