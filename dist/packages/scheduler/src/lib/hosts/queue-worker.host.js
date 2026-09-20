"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueWorkerHost = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const scheduler_constants_1 = require("../constants/scheduler.constants");
class QueueWorkerHost extends bullmq_1.WorkerHost {
    async process(job, token) {
        const handler = this.getHandlers().get(job.name);
        if (!handler) {
            const available = Array.from(this.getHandlers().keys());
            throw new Error(`No handler found for queue job "${job.name}" in ${this.constructor.name}. Available handlers: ${available.join(', ')}`);
        }
        return handler(job, token);
    }
    getHandlers() {
        if (this.handlerMap) {
            return this.handlerMap;
        }
        const handlers = new Map();
        const prototype = Object.getPrototypeOf(this);
        const methodNames = Object.getOwnPropertyNames(prototype);
        for (const methodName of methodNames) {
            if (methodName === 'constructor') {
                continue;
            }
            const methodRef = prototype[methodName];
            if (typeof methodRef !== 'function') {
                continue;
            }
            const handlerName = Reflect.getMetadata(scheduler_constants_1.QUEUE_JOB_HANDLER_METADATA, methodRef);
            if (!handlerName) {
                continue;
            }
            if (handlers.has(handlerName)) {
                throw new Error(`Duplicate queue job handler "${handlerName}" in ${this.constructor.name}.`);
            }
            const target = this;
            handlers.set(handlerName, (job, token) => target[methodName](job, token));
        }
        this.handlerMap = handlers;
        return handlers;
    }
}
exports.QueueWorkerHost = QueueWorkerHost;
//# sourceMappingURL=queue-worker.host.js.map