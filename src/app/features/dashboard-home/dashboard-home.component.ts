import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { TaskService } from '../../services/task/task.service';
import { Task } from '../../models/task.model';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { AuthService } from '../../services/auth/auth.service';
import { filter, switchMap } from 'rxjs/operators';
import { UserProfile } from '../../models/user.model';
import { convertTimestampToDate } from '../../utils/date-utils';

@Component({
  selector: 'app-dashboard-home',
  imports: [CommonModule, MatCardModule, MatListModule],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.scss'
})
export class DashboardHomeComponent implements OnInit {
  private auth = inject(Auth);
  private authService = inject(AuthService)
  private taskService = inject(TaskService);
  tasks = signal<Task[]>([]);
  userProfile = signal<UserProfile | null>(null);

  ngOnInit(): void {
    this.authService.userProfile$.subscribe((profile) => {
      this.userProfile.set(profile);

      if (!profile) return;

      if (profile.role === 'admin') {
        // Admin: load all tasks
        this.taskService.getAllTasks().subscribe((tasks) => this.tasks.set(tasks));
      } else {
        // Member: load own tasks
        this.taskService.getUserTasks(profile.uid).subscribe((tasks) => this.tasks.set(tasks));
      }
    });
  }

  pendingCount = () => this.tasks().filter(t => t.status === 'pending').length;
  completedCount = () => this.tasks().filter(t => t.status === 'completed').length;
  overdueCount = () => this.tasks().filter(t => t.status === 'overdue').length;

  todaysTasks = () => {
    const todayStr = new Date().toDateString();
    return this.tasks().map(t => ({
      ...t,
      dueDate: convertTimestampToDate(t.dueDate) // convert Timestamp to JS Date
    })).filter(t => {
      // Check if dueDate is not null before calling toDateString
    return t.dueDate !== null && t.dueDate.toDateString() === todayStr;
    });
  };
  
}
