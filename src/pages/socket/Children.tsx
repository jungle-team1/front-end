import { useEffect, useRef } from "react";

import { Socket } from "socket.io-client";
import useSocketStore from "../../store/socket/useSocketStore";



export const Children = () => {
    const socket = useSocketStore((state) => state.socket);
    const socketRef = useRef<Socket | null>(null);
    const component = "Children";

    useEffect(() => {
        socketRef.current = socket;

        socketRef.current?.emit("send_socket_id", component);
    }, [socket]);

    return <>children</>;
};