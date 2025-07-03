// task-form.component.ts
import { Component, inject, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { AuthService } from '../../../services/auth/auth.service';
import { UserProfile } from '../../../models/user.model';
import { Task } from '../../../models/task.model';
import { convertTimestampToDate } from '../../../utils/date-utils';

@Component({
  selector: 'app-task-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatOptionModule
  ],
  templateUrl: './taskform.component.html',
  styleUrl: './taskform.component.scss'
})
export class TaskFormComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<TaskFormComponent>);
  private authService = inject(AuthService);
  private data: Task | null = inject(MAT_DIALOG_DATA, {optional: true})

  users: UserProfile[] = [];
  isEditmode: boolean = false;

  ngOnInit(): void {
    this.isEditmode = !!this.data;

    if(this.isEditmode && this.data){
      // Patch form with existing data
      this.taskForm.patchValue({
        title: this.data.title,
        dueDate: convertTimestampToDate(this.data.dueDate),
        status: this.data.status,
        assignedTo: this.data.assignedTo
      })
    }

    this.authService.getAllUsers().subscribe(users => {
      this.users = users.filter(user => user.role === 'member'); // or any filter you want
    });
  }

  taskForm = this.fb.group({
    title: ['', Validators.required],
    dueDate: [new Date(), Validators.required],
    status: ['pending'],
    assignedTo: ['', Validators.required]
  });

  submitForm() {
    if (this.taskForm.invalid) return;
    this.dialogRef.close(this.taskForm.value); // send data back to parent
  }

  close() {
    this.dialogRef.close();
  }
}
