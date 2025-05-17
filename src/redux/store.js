// store.js
import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";

// Import your reducers
import authSlice from "./slices/authSlice";
import teamSlice from "./slices/teamSlice";
import projectSlice from "./slices/projectSlice";
import sprintsSlice from "./slices/sprintsSlice";

// Configure persist
const persistConfig = {
  key: "root",
  storage,
};

// Combine reducers if you have multiple
const rootReducer = combineReducers({
  auth: authSlice,
  team: teamSlice,
  project: projectSlice,
  sprints: sprintsSlice,
});

// Wrap the combined reducers with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with persisted reducer
const store = configureStore({
  reducer: persistedReducer,
  devTools: true,
});

const persistor = persistStore(store);

export { store, persistor };
