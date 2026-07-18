import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private snackBar = inject(MatSnackBar);

  success(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['bg-green-600', 'text-white'],
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
  }

  error(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['bg-red-600', 'text-white'],
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
  }

  info(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['bg-blue-600', 'text-white'],
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
  }
}
