export enum EStatus {
  open,
  running,
  closed
}

export interface Task {
  id: number;
  name: string;
  status: EStatus;
  startDate: Date;
  assignee: number;
}
export interface Module {
  id: number;
  name: string;
  budget: 1000;
  dueDate: Date;
  tasks: Task[];
}

export interface Project {
  projectId: number;
  name: string;
  modules: Module[];
}
