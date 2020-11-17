export class Task {
  constructor(
    public id: number,
    public task: Text,
    public createdBy: number,
    public priority: string,
    public status: string
  ){}
}
