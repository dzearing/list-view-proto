import { Logger } from './Logger';
export declare class RequestContext {
    private static _instance;
    private _correlationId;
    readonly correlationId: string;
    private _logger;
    readonly logger: Logger;
    constructor(correlationId: string);
}
