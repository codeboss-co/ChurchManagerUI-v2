import { InjectionToken } from '@angular/core';

export const constants = {
    error: 'error',
};

/**
 *  @summary Environment Injection Token
 *
 *  to use, inject:    @Inject( ENV ) private environment
 */
export const ENV = new InjectionToken('ENV');
