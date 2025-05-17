import { createSlice } from '@reduxjs/toolkit';
import { sprintsData } from '../../Utils/InitialDataValues/SprintsData';

const initialState = {
  projects: sprintsData,
};

const sprintsSlice = createSlice({
  name: 'sprints',
  initialState,
  reducers: {
    // Action to add a task to a specified project and status
    addSprint: (state, action) => {
      const { projectName, task, status } = action.payload;
      // Check if the project exists, if not, initialize it with empty sprint data categories
      if (!state.projects[projectName]) {
        state.projects[projectName] = {
          projectName: projectName,
          sprintsData: {
            todo: [],
            inProgress: [],
            needReview: [],
            Complete: [],
          },
        };
      }
      // Push the new task into the specified sprint status
      state.projects[projectName].sprintsData[status].push(task);
    },
    // Action to update a task in a specified project and status
    // updateSprint: (state, action) => {
    //   const { projectName, taskId, updatedTask, status } = action.payload;
    //   const tasks = state.projects[projectName]?.sprintsData[status];
    //   if (tasks) {
    //     const taskIndex = tasks.findIndex((task) => task.id === taskId);
    //     if (taskIndex !== -1) {
    //       tasks[taskIndex] = { ...tasks[taskIndex], ...updatedTask };
    //     }
    //   }
    // },
    updateSprint: (state, action) => {
      const {
        projectName,
        taskId,
        updatedTask,
        status: newStatus,
      } = action.payload;

      // Find the project
      const project = state.projects[projectName];
      if (project) {
        const sprintsData = project.sprintsData;

        // Find the current status of the task
        const currentStatus = Object.keys(sprintsData).find((status) =>
          sprintsData[status].some((task) => task.id === taskId)
        );

        if (currentStatus) {
          // Remove the task from the current status array
          const taskIndex = sprintsData[currentStatus].findIndex(
            (task) => task.id === taskId
          );
          if (taskIndex !== -1) {
            const task = sprintsData[currentStatus][taskIndex];

            // Remove the task from the current status array
            sprintsData[currentStatus].splice(taskIndex, 1);

            // Add the task to the new status array with updated details
            sprintsData[newStatus].push({
              ...task,
              ...updatedTask,
              status: newStatus,
            });
          }
        }
      }
    },
    // Action to delete a task from a specified project and status
    deleteSprint: (state, action) => {
      const { projectName, taskId, status } = action.payload;
      const tasks = state.projects[projectName]?.sprintsData[status];
      if (tasks) {
        state.projects[projectName].sprintsData[status] = tasks.filter(
          (task) => task.id !== taskId
        );
      }
    },
  },
});

export const { addSprint, updateSprint, deleteSprint } = sprintsSlice.actions;
export default sprintsSlice.reducer;
