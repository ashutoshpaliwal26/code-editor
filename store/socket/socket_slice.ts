import { SocketState } from "@/types";
import { createSlice } from "@reduxjs/toolkit"
import io from 'socket.io-client'

let initialState : SocketState | null = null;

if (typeof window !== 'undefined') {
    initialState = {
        socket : io(process.env.NEXT_PUBLIC_SOCKET_URL as string)
    }
}

export const socketSlice = createSlice({
    name: "Socket",
    initialState,
    reducers: {}
})

export default socketSlice.reducer;
