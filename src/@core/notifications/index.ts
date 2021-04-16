import { ToastrService } from '@core/notifications/toastr.service';
import { MatSnackBarService } from '@core/notifications/mat-snack-bar.service';

export const notificationToastrProvider =
    {provide: ToastrService, useClass: MatSnackBarService};

export * from './notification';
