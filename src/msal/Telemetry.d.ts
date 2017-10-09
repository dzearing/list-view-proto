export declare class Telemetry {
    private static instance;
    private receiverCallback;
    constructor();
    RegisterReceiver(receiverCallback: (receiver: Array<Object>) => void): void;
    static GetInstance(): Telemetry;
}
