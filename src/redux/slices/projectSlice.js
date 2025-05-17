import { createSlice } from '@reduxjs/toolkit';
import { projectsData } from '../../Utils/InitialDataValues/ProjectsData';

const initialState = {
  projects: projectsData,
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    addProject: (state, action) => {
      state.projects.push(action.payload);
    },
    updateProject: (state, action) => {
      const index = state.projects.findIndex(
        (project) => project.id === action.payload.id
      );
      if (index !== -1) {
        state.projects[index] = action.payload;
      }
    },
    deleteProject: (state, action) => {
      state.projects = state.projects.filter(
        (project) => project.id !== action.payload
      );
    },
  },
});

export const { addProject, updateProject, deleteProject } =
  projectSlice.actions;
export default projectSlice.reducer;
