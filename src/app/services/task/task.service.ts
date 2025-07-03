import { Injectable, inject } from '@angular/core';
import { Firestore, collectionData, collection, addDoc, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Task } from '../../models/task.model';
import { Observable } from 'rxjs';
import { query, where } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private firestore = inject(Firestore);
  private taskCollection = collection(this.firestore, 'tasks');
  
  getAllTasks(): Observable<Task[]> {
    return collectionData(this.taskCollection, { idField: 'id' }) as Observable<Task[]>;
  }

  getUserTasks(userID: string): Observable<Task[]> {
    const tasks = query(this.taskCollection, where('assignedTo', '==', userID ))
    return collectionData(tasks, { idField: 'id' }) as Observable<Task[]>;
  }

  createTask(task: any): Promise<any> {
    const taskRef = collection(this.firestore, 'tasks');
    return addDoc(taskRef, task);
  }

  updateTask(taskId: string, updatedData: Partial<Task>): Promise<void> {
    const taskDocRef = doc(this.firestore, `tasks/${taskId}`);
    return updateDoc(taskDocRef, updatedData);
  }

  deleteTask(taskId: string): Promise<void> {
    const taskDocRef = doc(this.firestore, `tasks/${taskId}`);
    return deleteDoc(taskDocRef);
  }
}
