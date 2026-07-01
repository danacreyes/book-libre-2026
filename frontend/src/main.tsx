import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router"
import App from "./App"
import "./index.css"
import { AuthProvider } from "./context/AuthContext"
import { UserProfileProvider } from "./context/UserProfileContext"
import "./config/axiosConfig"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <UserProfileProvider>
          <App />
        </UserProfileProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
