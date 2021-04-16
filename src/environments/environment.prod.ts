import { Environment } from '@shared/environment.model';

export const environment: Environment  = {
    production: true,
    baseUrls: {
        signalRHub: '/signalr-hub',
        apiUrl: '/api'
    },
    amplify: {
        Auth: {
            region: 'us-east-1',
            userPoolId: 'us-east-1_i6pWJxu8q',
            userPoolWebClientId: '3a8h0si9ejnbi2mnnhfti5m66r'
        }
    },
    contentful: {
        spaceId: 'od8d9ub5fano',
        token: 'l7jzfAF0vA1o7DX0Bj0ecJr8yxrpIoGFmFinLYmy1wg'
    }
};
