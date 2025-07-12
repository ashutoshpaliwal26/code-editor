import { AuthState, UserState } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit"


const initialState: AuthState = {
    user : null,
    showAuthModel : true
}

export const authSlice = createSlice({
    name: "Auth",
    initialState,
    reducers: {
        setUser : (state, actions : PayloadAction<UserState>) => {
            state.user = actions.payload;
        },
        setShowAuthModel : (state, actions : PayloadAction<boolean>) => {
            state.showAuthModel = actions.payload;
        }
    }
})

export const { setUser, setShowAuthModel } = authSlice.actions;

export default authSlice.reducer;