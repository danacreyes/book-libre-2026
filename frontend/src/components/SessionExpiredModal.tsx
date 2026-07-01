import { useEffect } from "react"
import { FocusTrap } from 'focus-trap-react'

const SessionExpiredModal = ({ onClick }: { onClick: () => void }) => {
  
  useEffect(() => {
    document.body.classList.add("overflow-hidden")
    return () => document.body.classList.remove("overflow-hidden")
  }, [])

  return (
    <FocusTrap>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
        <div className="bg-white p-8 rounded-lg flex flex-col items-center gap-4 max-w-sm w-full">
          <h2 className="text-lg font-bold">Tu sesión expiró</h2>
          <p>Por seguridad, tu sesión fue cerrada automáticamente.</p>
          <button onClick={onClick}
            className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
            Volver a iniciar sesión
          </button>
        </div>
      </div>
    </FocusTrap>
  )
}

export default SessionExpiredModal