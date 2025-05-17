export const transformProjectsData = (projects) => {
  const result = [];

  for (const [projectKey, projectValue] of Object.entries(projects)) {
    const { projectName, sprintsData } = projectValue;

    for (const [status, tasks] of Object.entries(sprintsData)) {
      tasks.forEach((task) => {
        result.push({
          projectName,
          status,
          ...task,
        });
      });
    }
  }

  return result;
};
