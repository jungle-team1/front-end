import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from "./api/user/Login"
import Oauth from './api/oauth/Oauth'
import Canvas from './api/canvas/Canvas'

function App() {
  return (
    <>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/oauth/login' element={<Oauth />} />
        <Route path='/canvas' element={<Canvas />} />
      </Routes>
    </>
  )
}

export default App
