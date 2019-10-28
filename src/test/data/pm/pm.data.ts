import { EStatus, Project } from './pm.types';

const modules = [
  {
    id: 1,
    name: 'Backend',
    budget: 1000,
    dueDate: new Date('12-01-2020'),
    tasks: [
      {
        id: 1,
        name: 'Database',
        status: EStatus.closed,
        startDate: new Date('20-11-2019'),
        assignee: 4
      },
      {
        id: 2,
        name: 'ORM',
        status: EStatus.running,
        startDate: new Date('20-11-2019'),
        assignee: 3
      },
      {
        id: 3,

        name: 'Http',
        status: EStatus.open,
        startDate: new Date('24-12-2019'),
        assignee: 2
      }
    ]
  },
  {
    id: 2,
    name: 'Frontend',
    budget: 2000,
    dueDate: new Date('24-03-2020'),
    tasks: []
  },
  {
    id: 3,
    name: 'Reporting',
    budget: 10000,
    dueDate: new Date('28-12-2024'),
    tasks: []
  }
];

export const unitTestProjectData = <Project>{
  projectId: 1,
  name: 'Project 1',
  modules: modules
};
