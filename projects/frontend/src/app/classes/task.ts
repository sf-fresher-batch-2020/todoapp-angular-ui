export class Task {
  constructor(
    public id: number,
    public task: Text,
    public created_by: number,
    public priority: String,
    public status: String
  ){}
}
