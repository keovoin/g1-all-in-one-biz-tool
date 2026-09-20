"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeQueueRegistrations = normalizeQueueRegistrations;
exports.normalizeQueueName = normalizeQueueName;
const DEFAULT_QUEUE_NAME = 'default';
function normalizeQueueRegistrations(queueRegistrations) {
    const queueMap = new Map();
    for (const registration of queueRegistrations) {
        const option = typeof registration === 'string' ? { name: registration } : { ...registration };
        const queueName = normalizeQueueName(option.name);
        queueMap.set(queueName, {
            ...option,
            name: queueName
        });
    }
    return Array.from(queueMap.values());
}
function normalizeQueueName(name) {
    const queueName = name?.trim() ?? DEFAULT_QUEUE_NAME;
    if (!queueName) {
        throw new Error('Queue name cannot be empty.');
    }
    return queueName;
}
//# sourceMappingURL=normalize-queue-registrations.js.map