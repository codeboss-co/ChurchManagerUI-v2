import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';
import { ToastrService } from '@core/notifications/toastr.service';

@Injectable({providedIn: 'root'})
export class MatSnackBarService implements ToastrService {

  private _baseConfig: MatSnackBarConfig = {
    duration: 2000,
    verticalPosition: 'top',
    // horizontalPosition: 'end'
  };

  constructor(private snackBar: MatSnackBar) { }

  // this function will open up snackbar on top right position with custom background color (defined in css)
  open(message: string, action?: string, className?: string, config?: Partial<any>) {
    this.snackBar.open(message, action, this.withPanelClass(className, config));
  }

  default(message: string, action?: string, config?: Partial<any>) {
    this.snackBar.open(message, action,  this.withConfig(config));
  }

  info(message: string, action?: string, config?: Partial<any>) {
    this.snackBar.open(message, action, this.withPanelClass('blue-snackbar', config));
  }

  success(message: string, action?: string, config?: Partial<any>){
    this.snackBar.open(message, action, this.withPanelClass('green-snackbar', config));
  }

  error(message: string, action?: string, config?: Partial<any>){
    this.snackBar.open(message, action, this.withPanelClass('red-snackbar', config));
  }

  // Add `panelClass` to the snack bar config
  withPanelClass(className: string, overwriteConfig?: MatSnackBarConfig): MatSnackBarConfig {
    const config = Object.assign({}, this._baseConfig, {panelClass: [className]}, overwriteConfig);
    return config;
  }

  withConfig(overwriteConfig?: MatSnackBarConfig): MatSnackBarConfig {
    return Object.assign({}, this._baseConfig, overwriteConfig);
  }

}
