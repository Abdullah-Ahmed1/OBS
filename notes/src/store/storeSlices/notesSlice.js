import { createSlice } from '@reduxjs/toolkit';

const noteSlice = createSlice({
  name: 'note',
  initialState: { 
    tasks: [
        { id: Date.now(), content: "The first task" },
      ],
  },
  reducers: {
    addNote : (state,action)=>{
        state.tasks = [...(state.tasks),action.payload]
    }
  },
});

export const { addNote } = noteSlice.actions;

export default noteSlice.reducer;