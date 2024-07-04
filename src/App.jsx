import { Route, Routes } from 'react-router-dom'
import './App.css'
import GlobalStyles from './styles/GlobalStyles'

import Home from './pages/Home'
import Loading from './pages/Loading'
import Game1 from './pages/Game1'
import Start from './pages/Start'

import Login from "./api/user/Login"
import Oauth from './api/oauth/Oauth'
import Canvas from './api/canvas/Canvas'

function App() {
  return (
    <>
      <GlobalStyles />
      <Routes>
        <Route path='/' element={<Start />} />
        <Route path='/home' element={<Home />} />
        <Route path='/loading' element={<Loading />} />
        <Route path='/game' element={<Game1 />} />
        <Route path='/login' element={<Login />} />
        <Route path='/oauth/login' element={<Oauth />} />
        <Route path='/canvas' element={<Canvas />} />
      </Routes>
    </>
  )
}

export default App
