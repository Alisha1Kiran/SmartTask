import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { TaskService } from '../../services/task/task.service';
import { Task } from '../../models/task.model';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { AuthService } from '../../services/auth/auth.service';
import { filter, switchMap } from 'rxjs/operators';
import { UserProfile } from '../../models/user.model';
import { convertTimestampToDate } from '../../utils/date-utils';

@Component({
  selector: 'app-dashboard-home',
  imports: [CommonModule, MatCardModule, MatListModule, MatProgressBar, MatTableModule],
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

      const task$ = profile.role === 'admin'
        ? this.taskService.getAllTasks()
        : this.taskService.getUserTasks(profile.uid);

      task$.subscribe((tasks) => {
        const processed = tasks.map(t => ({
          ...t,
          dueDate: convertTimestampToDate(t.dueDate),
          createdAt: convertTimestampToDate(t.createdAt)
        }));
        this.tasks.set(processed);
      });
    });
  }

  pendingCount = () => this.tasks().filter(t => t.status === 'pending').length;
  completedCount = () => this.tasks().filter(t => t.status === 'completed').length;
  overdueCount = () => this.tasks().filter(t => t.status === 'overdue').length;

  totalTasks = () => this.tasks().length;
  progressPercent = () => {
    const total = this.totalTasks();
    return total === 0 ? 0 : Math.round((this.completedCount() / total) * 100);
  }

  todaysTasks = () => {
    const todayStr = new Date().toDateString();
    return this.tasks().filter(t =>
      t.dueDate && t.dueDate.toDateString() === todayStr
    );
  }

  nextUpcomingTask = () => {
    const now = new Date();
    return this.tasks()
      .filter(t => t.dueDate && t.dueDate >= now)
      .sort((a, b) => a.dueDate!.getTime() - b.dueDate!.getTime())[0];
  }
}
