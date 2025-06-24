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

const App = () => {

  const { loggedInUser, justLoggedIn } = useContext(UsersContext) as UsersContextTypes;

  return (
    <>
      <Routes>
        <Route path='' element={<MainOutlet />} >
          <Route index element={<Home />} />
          <Route path='savedPosts' element={<SavedPosts />} />
          <Route path='user' element={<User />} />
          <Route path='newPost' element={<CreatePost />} />
          <Route path='post/:topic/:title/:id' element={<ExpandedPost />} />
          <Route path='rules' element={<ForumRules />} />
          <Route path='about' element={<AboutUs />} />
        </Route>
        <Route path='register' element={!loggedInUser || justLoggedIn ? <Register /> : <Forbidden reason={`You are already logged in.`} />} />
        <Route path='login' element={!loggedInUser || justLoggedIn ? <Login /> : <Forbidden reason={`You are already logged in.`} />} />
      </Routes>
    </>
  )
}

export default App
