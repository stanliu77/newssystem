// import {combineReducers,createStore} from "redux"
// import {loadingReducer} from "./reducer/loadingReducer"
// import {siderReducer} from "./reducer/siderReducer"
// const reducer = combineReducers({siderReducer,loadingReducer})
// const store = createStore(reducer)
// export default store
import { configureStore,combineReducers } from '@reduxjs/toolkit'
import siderSlice from './reducer/siderSlice'
import loadSlice from './reducer/loadSlice'
import { persistStore, persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
const rootReducer = combineReducers({
    sider:siderSlice,
    loading:loadSlice
})
const persistConfig = {
    key: 'root',
    storage,
    blacklist: ['loading']
  }
const persistedReducer = persistReducer(persistConfig, rootReducer)
const store = configureStore({
  reducer: persistedReducer
})
let persistor = persistStore(store)
export {store,persistor}