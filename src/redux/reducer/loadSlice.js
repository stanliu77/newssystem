import { createSlice } from '@reduxjs/toolkit'
export const loadSlice = createSlice({
    name:"loading",
    initialState:{
        isload:true
    },
    reducers:{
        loading:(state,action)=>{
            state.isload = action.payload
        }
    }
})
export const {loading}  = loadSlice.actions
export default loadSlice.reducer
