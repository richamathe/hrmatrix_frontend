import { createSlice } from '@reduxjs/toolkit';
import { membersData } from '../../Utils/InitialDataValues/MembersData';

const teamSlice = createSlice({
  name: 'team',
  initialState: {
    members: membersData,
  },
  reducers: {
    addMember: (state, action) => {
      state.members.push({ ...action.payload, id: Date.now() });
    },
    updateMember: (state, action) => {
      const index = state.members.findIndex(
        (member) => member.id === action.payload.id
      );
      if (index !== -1) {
        state.members[index] = action.payload;
      }
    },
    deleteMember: (state, action) => {
      state.members = state.members.filter(
        (member) => member.id !== action.payload
      );
    },
  },
});

export const { addMember, updateMember, deleteMember } = teamSlice.actions;
export default teamSlice.reducer;
