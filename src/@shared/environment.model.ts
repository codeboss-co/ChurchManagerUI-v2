import { AuthOptions } from '@aws-amplify/auth/lib/types';

export interface Environment {
    production?: boolean;

    // Api configuration
    baseUrls: {
        signalRHub: string,
        apiUrl: string
    };

    // AWS Cognito Configuration
    amplify: {
        Auth: AuthOptions
    };

    // Contentful CMS
    contentful: {
        spaceId: string,
        token: string;
        environment?: string;  // defaults to `master`
    };

    push: {
        publicKey: string
    };
}
