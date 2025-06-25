import { Route, Routes } from "react-router"
import MainOutlet from "./components/outlets/MainOutlet"
import Home from "./components/pages/Home"
import Register from "./components/pages/Register"
import Login from "./components/pages/Login"
import User from "./components/pages/UserPage"
import CreatePost from "./components/pages/CreatePost"
import ExpandedPost from "./components/pages/ExpandedPost"
import SavedPosts from "./components/pages/SavedPosts"
import ForumRules from "./components/pages/ForumRules"
import AboutUs from "./components/pages/AboutUs"
import { useContext } from "react"
import UsersContext from "./components/contexts/UsersContext"
import { UsersContextTypes } from "./types"
import Forbidden from "./components/pages/Forbidden"
import FourZeroFour from "./components/pages/FourZeroFour"

const App = () => {

  const { justLoggedIn, decodeUserFromToken } = useContext(UsersContext) as UsersContextTypes;
  const decodedUser = decodeUserFromToken();

  return (
    <>
      <Routes>
        <Route path='' element={<MainOutlet />} >
          <Route index element={<Home />} />
          <Route path='savedPosts' element={decodedUser ? <SavedPosts /> : <Forbidden reason={`You must login to access this page.`} />} />
          <Route path='user' element={decodedUser ? <User /> : <Forbidden reason={`You must login to access this page.`} />} />
          <Route path='newPost' element={decodedUser ? <CreatePost /> : <Forbidden reason={`You must login to access this page.`} />} />
          <Route path='post/:topic/:title/:id' element={<ExpandedPost />} />
          <Route path='rules' element={<ForumRules />} />
          <Route path='about' element={<AboutUs />} />
        </Route>
        <Route path='register' element={!decodedUser || justLoggedIn ? <Register /> : <Forbidden reason={`You are already logged in.`} />} />
        <Route path='login' element={!decodedUser || justLoggedIn ? <Login /> : <Forbidden reason={`You are already logged in.`} />} />
        <Route path='*' element={<FourZeroFour />} />
      </Routes>
    </>
  )
}

export default App
