import { Timestamp } from '@angular/fire/firestore';

export interface Task {
    id?: string;
    title: string;
    dueDate: Date | null;
    status: 'pending' | 'completed' | 'overdue';
    assignedTo: string;
    createdAt?: Date | null;
  }