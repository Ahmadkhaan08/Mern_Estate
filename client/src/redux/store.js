import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userReducer from './user/userSlice';
import storage from 'redux-persist/lib/storage'
import {persistReducer, persistStore} from 'redux-persist'

//combine Reducers
const rootReducer=combineReducers({
  user:userReducer,
})

//configuration for persisting the store
const persistConfig={
  key:'root',
  storage,
  version:1,
}

// Apply persistReducer to  rootReducer
const persistedReducer=persistReducer(persistConfig,rootReducer)

// Configure the Redux store
export const store = configureStore({
  reducer: persistedReducer,
  middleware:(getDefaultMiddleware)=>
getDefaultMiddleware({
    serializableCheck:false,
}),
  
})

export const persistor=persistStore(store)
