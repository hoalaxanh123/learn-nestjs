export class Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;

  constructor(id: number, title: string, description: string) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.status = TaskStatus.OPEN;
  }
}

export enum TaskStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}
