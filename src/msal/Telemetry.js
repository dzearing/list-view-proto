"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Telemetry = (function () {
    function Telemetry() {
    }
    Telemetry.prototype.RegisterReceiver = function (receiverCallback) {
        this.receiverCallback = receiverCallback;
    };
    Telemetry.GetInstance = function () {
        return this.instance || (this.instance = new this());
    };
    return Telemetry;
}());
exports.Telemetry = Telemetry;
//# sourceMappingURL=Telemetry.js.map