import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import AppRouter from "./router/AppRouter"

// App.tsx
function App() {
  

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={4000} />
      <AppRouter />
    </>
  )
}

export default App
