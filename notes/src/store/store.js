import { configureStore } from '@reduxjs/toolkit';
import noteReducer from './storeSlices/notesSlice'; // Your slice's reducer

const store = configureStore({
  reducer: {
    notes: noteReducer,
  },
});

export default store;