export declare class XhrClient {
    sendRequestAsync(url: string, method: string, enableCaching?: boolean): Promise<any>;
    protected handleError(responseText: string): any;
}
