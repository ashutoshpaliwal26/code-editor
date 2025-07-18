"use client"

import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./auth/authSlice"
import socketReducer from './socket/socket_slice'
import filesReducer from './files/fileSlice'

export const store = configureStore({
    reducer : {
        auth: authReducer,
        socket: socketReducer,
        files : filesReducer
    }
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch