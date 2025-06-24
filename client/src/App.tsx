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

const App = () => {


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
        </Route>
        <Route path='register' element={<Register />} />
        <Route path='login' element={<Login />} />
      </Routes>
    </>
  )
}

export default App
