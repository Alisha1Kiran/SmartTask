import { Injectable, inject } from '@angular/core';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { Task } from '../../models/task.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private firestore = inject(Firestore);
  private taskCollection = collection(this.firestore, 'tasks');
  
  getTasks(): Observable<Task[]> {
    return collectionData(this.taskCollection, { idField: 'id' }) as Observable<Task[]>;
  }
}
