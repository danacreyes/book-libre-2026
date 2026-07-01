import { IconEye, IconEyeOff } from '@tabler/icons-react';

const VisibilityIcon = ({ visibilityTipe, setVisibilityTipe }: { visibilityTipe: string; setVisibilityTipe: React.Dispatch<React.SetStateAction<string>> }) => {
  return (
    <div className='pointer-events-none relative -mt-10 mr-3 flex h-10 items-center justify-end'>
    {visibilityTipe === "password" ? (
    <IconEyeOff stroke={2} onClick={() => setVisibilityTipe("text")} 
    className='pointer-events-auto cursor-pointer' />
    ) : (
    <IconEye stroke={2} onClick={() => setVisibilityTipe("password")} 
    className='pointer-events-auto cursor-pointer' />
    )}
    </div>
  )
}

export default VisibilityIcon