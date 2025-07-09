import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task/task.service';
import { AuthService } from '../../services/auth/auth.service';
import { Task } from '../../models/task.model';
import { UserProfile } from '../../models/user.model';
import { TaskFormComponent } from '../taskHelperComponents/taskform/taskform.component';
import { convertTimestampToDate } from '../../utils/date-utils';
import { NotificationService } from '../../services/notification/notification.service';

@Component({
  selector: 'app-tasks',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
})
export class TasksComponent implements OnInit {
  private taskService = inject(TaskService);
  private authService = inject(AuthService);
  private taskDialog = inject(MatDialog);
  private notificationService = inject(NotificationService);

  tasks = signal<Task[]>([]);
  filteredTasks = signal<Task[]>([]);
  userProfile = signal<UserProfile | null>(null);
  selectedStatus = 'all';
  selectedAssignee = 'all';
  allUsers: UserProfile[] = [];

  ngOnInit(): void {
    this.authService.userProfile$.subscribe((profile) => {
      this.userProfile.set(profile);
      if (!profile) return;

      // Populate users differently for admin/member
      if (profile.role === 'admin') {
        this.authService.getAllUsers().subscribe((users) => {
          this.allUsers = users.filter((user) => user.role === 'member');
        });
      } else {
        this.allUsers = [profile]; // only self for member
      }

      const task$ =
        profile.role === 'admin'
          ? this.taskService.getAllTasks()
          : this.taskService.getUserTasks(profile.uid);

      task$.subscribe((tasks) => {
        const processedTasks = tasks.map((task) => {
          const dueDate = convertTimestampToDate(task.dueDate);
          const createdAt = convertTimestampToDate(task.createdAt);

          // Overdue check logic here
          const today = new Date();
          if (dueDate && dueDate < today && task.status === 'pending') {
            this.taskService.updateTask(task.id!, { status: 'overdue' });
          }

          return {
            ...task,
            dueDate,
            createdAt,
            assignedTo: task.assignedTo,
          };
        });
        this.tasks.set(processedTasks);
        this.applyFilter();
      });
    });

    // this.authService.getAllUsers().subscribe((users) => {
    //   this.allUsers = users.filter((user) => user.role === 'member');
    // });
  }

  applyFilter() {
    const status = this.selectedStatus;
    const assignee = this.selectedAssignee;
    const tasks = this.tasks();
    let filtered = tasks;

    if (status !== 'all') {
      filtered = filtered.filter((task) => task.status === status);
    }

    if (assignee !== 'all') {
      filtered = filtered.filter((task) => task.assignedTo === assignee);
    }

    this.filteredTasks.set(filtered);
  }

  getAssigneeName(uid: string): string {
    const user = this.allUsers.find((u) => u.uid === uid);
    return user?.name || user?.email || 'Unknown';
  }

  openTaskForm() {
    const dialogRef = this.taskDialog.open(TaskFormComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((formData) => {
      if (formData) {
        const dueDateWithTime = new Date(formData.dueDate);
        dueDateWithTime.setHours(16, 0, 0, 0); // 4 PM
        const task = {
          ...formData,
          dueDate: dueDateWithTime,
          createdAt: new Date(),
          assignedTo: formData.assignedTo,
        };
        this.taskService.createTask(task).then(() => {
          this.notificationService.success('Task created successfully');
        });
      }
    });
  }

  // Edit Task
  editTask(task: Task) {
    const dialogRef = this.taskDialog.open(TaskFormComponent, {
      width: '400px',
      data: task, // pass current task
    });

    dialogRef.afterClosed().subscribe((formData) => {
      if (formData) {
        const dueDateWithTime = new Date(formData.dueDate);
        dueDateWithTime.setHours(16, 0, 0, 0); // 4 PM
        const updatedTask = {
          ...formData,
          dueDate: dueDateWithTime,
          assignedTo: formData.assignedTo,
        };

        this.taskService.updateTask(task.id!, updatedTask).then(() => {
          this.notificationService.success('Task updated successfully');
        });
      }
    });
  }

  //Delete Task
  deleteTask(taskId: string) {
    const confirmMessage = confirm('Are you sure you wan to delete this task?');
    if (confirmMessage) {
      this.taskService.deleteTask(taskId).then(() => {
        this.notificationService.success('Task deleted successfully');
      });
    }
  }

  markTaskAsCompleted(taskId: string) {
    this.taskService
      .updateTask(taskId, {
        status: 'completed',
      })
      .then(() => {
        this.notificationService.success('Task status changed successfully');
      });
  }
}
