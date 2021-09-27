import { Pipe, PipeTransform } from '@angular/core';
import { AuthService } from '@core/auth/auth.service';

/**
 * UserRoles allowed
 */
@Pipe({
    name: 'userRoles',
    pure: true
})
export class UserRolesPipe implements PipeTransform
{
    constructor(private _auth: AuthService) {}

    transform( allowedRoles: string[] ): boolean {
        return this._auth.hasRoles(allowedRoles);
    }
}