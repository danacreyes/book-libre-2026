import { Navigate } from "react-router"
import { getId } from '@/context/AuthContext'

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  //const user = localStorage.getItem('user');
  const userId = getId()
  
  if (!userId) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};