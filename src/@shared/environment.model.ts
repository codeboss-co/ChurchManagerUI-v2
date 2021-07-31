export interface Environment {
    production?: boolean;

    // Api configuration
    baseUrls: {
        signalRHub: string;
        apiUrl: string;
    };

    // Contentful CMS
    contentful: {
        spaceId: string;
        token: string;
        environment?: string;  // defaults to `master`
    };

    push: {
        publicKey: string;
    };
}
