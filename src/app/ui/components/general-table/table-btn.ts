import { InjectionToken } from '@angular/core';

export interface TableBtn {
  styleClass: string;
  icon: string;
  payload: (any) => string;
  action: string;
}


/**
 *  @summary Pagination Service Token
 *
 *  to use, inject:    @Inject( PAGING_DATA ) private service
 */
export const PAGING_SERVICE = new InjectionToken('Paginated Datasource service');