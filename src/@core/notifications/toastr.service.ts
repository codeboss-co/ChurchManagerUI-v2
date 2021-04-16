/**
 * The `ToastrService` provides a capability to build toast notifications.
 *
 *  * @NgModule({
 *   imports: [
 *     // ...
 *   ],
 *   providers: [
 *      {provide: ToastrService, useClass: NbToastrService}
 *   ]
 * })
 * */
export abstract class ToastrService {
  abstract open(message: string, action?: string, className?: string, config?: Partial<any>): any;
  abstract default(message: string, action?: string, config?: Partial<any>): any;
  abstract info(message: string, action?: string, config?: Partial<any>): any;
  abstract success(message: string, action?: string, config?: Partial<any>): any;
  abstract error(message: string, action?: string, config?: Partial<any>): any;
}
