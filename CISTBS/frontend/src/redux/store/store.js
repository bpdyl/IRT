// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import incidentReducer from '../reducer/incidentSlice';
import taskReducer from '../reducer/taskSlice';
import followUpReducer from '../reducer/followUpSlice';
// Configure the Redux store with configureStore
const store = configureStore({
  reducer: {
    incident: incidentReducer, // Add other reducers here if needed
    tasks: taskReducer,
    followUps: followUpReducer,
  },
  // Optional: customize the middleware, devTools, etc.
});

export default store;