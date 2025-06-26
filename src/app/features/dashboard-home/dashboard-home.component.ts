import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { toSignal } from '@angular/core/rxjs-interop';
import { TaskService } from '../../services/task/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-dashboard-home',
  imports: [CommonModule, MatCardModule, MatListModule],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.scss'
})
export class DashboardHomeComponent {
  private taskService = inject(TaskService);
  tasks = toSignal(this.taskService.getTasks(), { initialValue: [] });

  pendingCount = () => this.tasks().filter(t => t.status === 'pending').length;
  completedCount = () => this.tasks().filter(t => t.status === 'completed').length;
  overdueCount = () => this.tasks().filter(t => t.status === 'overdue').length;

  todaysTasks = () => {
    const todayStr = new Date().toDateString();
    return this.tasks().filter(t => {
      const taskDateStr = new Date(t.dueDate).toDateString();
      return taskDateStr === todayStr;
    });
  };
  
}
