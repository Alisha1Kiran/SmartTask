export interface Task {
    id?: string;
    title: string;
    dueDate: string;
    status: 'pending' | 'completed' | 'overdue';
}