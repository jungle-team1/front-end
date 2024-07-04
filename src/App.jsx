import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from "./api/user/Login"
import Canvas from "./pages/Canvas.jsx";
import useSocketStore from "./store/useSocketStore.tsx";
import {useEffect, useRef} from "react";
import {io, Socket} from "socket.io-client";


function App() {
    const {socket, setSocket} = useSocketStore();
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        const socketConnect = io(import.meta.env.VITE_SOCKET_SERVER_URL);
        setSocket(socketConnect);
        // socketRef.current = socketConnect;
        //
        // socketRef.current.on("connect",() => {
        //     socketRef.current.emit("connenct_check", "ㅎㅇㅎㅇ");
        // });
        //
        // return () => {
        //     socketRef.current.disconnect();
        // };


        socketConnect.on("connect",() => {
            socketConnect.emit("connenct_check", "ㅎㅇㅎㅇ");
        });

        return () => {
            socketConnect.disconnect();
        };
    }, [setSocket]);



  return (
    <>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/test' element={<Canvas />} />
      </Routes>
    </>
  )
}

export default App
