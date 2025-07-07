import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar'

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private snackBar = inject(MatSnackBar);

  showSnackBar(message: string, action = 'Close', duration = 3000, panelClass = '') {
    this.snackBar.open(message, action, {
      duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: panelClass ? [panelClass] : undefined,
    });
  }

  success(msg: string) {
    this.showSnackBar(msg, 'Close', 3000, 'snack-success');
  }
  
  error(msg: string) {
    this.showSnackBar(msg, 'Close', 3000, 'snack-error');
  }
}
