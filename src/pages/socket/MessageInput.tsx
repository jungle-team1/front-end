import {useEffect, useState} from "react";
import {io, Socket} from "socket.io-client";
import useSocketStore from "../../store/socket/useSocketStore";

export default function MessageInput() {
    const [socket, setSocket] = useState<Socket>();
    const [messages, setMessages] = useState<string[]>([]);

    const [value, setValue] = useState("");

    const send = (value: string) => {
        socket?.emit("message", value);
    }

    useEffect(() => {
        const newSocket = io("http://localhost:3030");
        setSocket(newSocket);
    }, [setSocket]);

    const messageListener = (message: string) => {
        console.log(message);
        setMessages([...messages, message]);
    }

    useEffect(() => {
        socket?.on("chat", messageListener);
        return () => {
            socket?.off("chat", messageListener);
        };
    }, [messageListener])

    return (
        <>
            {" "}
            <input placeholder="Type your message..." value={value} onChange={(e)=> setValue(e.target.value)}/>
            <button onClick={() => send(value)}>Send</button>
            <div>
                {messages.map((message, index) => (
                    <div key={index}>{message}</div>
                ))}
            </div>
        </>
    );
}