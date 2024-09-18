import { configureStore, combineReducers, ThunkAction, Action } from "@reduxjs/toolkit";
import {canvasReducer, connectorReducer} from "./canvas-reducers";

const rootReducer = combineReducers({
    canvas:canvasReducer,
    connectors:connectorReducer,
});

export const store = configureStore({ 
  reducer: rootReducer, 
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(), 
  devTools: process.env.NODE_ENV !== 'production' && {
    name: 'MyApp',
    trace: true,
    traceLimit: 25,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;