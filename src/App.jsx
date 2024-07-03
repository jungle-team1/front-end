import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from "./api/user/Login"
import MessageInput from "./pages/socket/MessageInput.tsx";
function App() {
  return (
    <>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/socket' element={<Login />} />
        <Route path='/test' element={<MessageInput />} />
      </Routes>
    </>
  )
}

export default App
