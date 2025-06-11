import { Route, Routes } from "react-router"
import MainOutlet from "./components/outlets/MainOutlet"
import Home from "./components/pages/Home"
import Register from "./components/pages/Register"
import Login from "./components/pages/Login"
import User from "./components/pages/UserPage"

const App = () => {


  return (
    <>
      <Routes>
        <Route path='' element={<MainOutlet />} >
          <Route index element={<Home />} />
          <Route path='user' element={<User />} />
        </Route>
        <Route path='register' element={<Register />} />
        <Route path='login' element={<Login />} />
      </Routes>
    </>
  )
}

export default App
