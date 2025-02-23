import { RouterProvider } from "react-router-dom"
import { router } from "./router"
import { Toaster } from "sonner"
import { AuthProvider } from "./contexts/AuthContext"

const App = () => {
  return (
    <>
      <AuthProvider>
          <Toaster position="bottom-right" duration={2000} />
          <RouterProvider router={router}/>
      </AuthProvider>
    </>
  )
}

export default App