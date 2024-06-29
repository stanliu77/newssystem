import { createSlice } from '@reduxjs/toolkit'
export const siderSlice = createSlice({
    name:"sider",
    initialState:{
        isfold:false
    },
    reducers:{
        sider:(state)=>{
            state.isfold = !state.isfold
        }
    }
})
export const {sider}  = siderSlice.actions
export default siderSlice.reducer
