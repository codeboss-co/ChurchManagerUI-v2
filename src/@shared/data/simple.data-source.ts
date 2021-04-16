import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs';

/**
 * @Title: Abstracts away the material datasource to what we really need
 *
 * https://medium.com/angular-in-depth/angular-material-pagination-datasource-73080d3457fe
 * */
export interface SimpleDataSource<T> extends DataSource<T> {
    connect(): Observable<T[]>;
    disconnect(): void;
}