import { FileStates } from "@/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
// Action 
export const fetchFiles = createAsyncThunk("fetchFiles", async () => {
    try{
        const res = await axios.get("http://localhost:8001/get-files");
        console.log("Response : ", res.data);
        if(res.status === 200){
            return res.data.tree
        }
        throw new Error("Fetch Error");
    }catch(err){
        throw new Error("Server Error");
    }
})

const initialState : FileStates = {
    loading : false,
    files : null,
    isError : false
}

const fileSlice = createSlice({
    name: "files",
    initialState: initialState,
    extraReducers: (builder) => {
        builder.addCase(fetchFiles.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(fetchFiles.fulfilled, (state, action) => {
            state.loading = false;
            console.log("Payload : ", action.payload);
            state.files = action.payload;
            console.log("Files : ", state.files);
        });
        builder.addCase(fetchFiles.rejected, (state, action) => {
            console.log("Error", action.payload);
            state.isError = true;
        });
    },
    reducers: {}
})

export default fileSlice.reducer;