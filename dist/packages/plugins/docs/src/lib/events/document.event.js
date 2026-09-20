"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentEvent = void 0;
const core_1 = require("@gauzy/core");
/**
 * Event class representing Documents events on the core RxJS event bus.
 *
 * Emitted on every CRUD mutation and every pipeline/knowledge/review transition; consumers
 * subscribe via `eventBus.ofType(DocumentEvent)` — this is the hook future capture paths
 * (chat/email attachments → documents) and other plugins build on.
 */
class DocumentEvent extends core_1.BaseEntityEvent {
    /**
     * Creates an instance of DocumentEvent.
     *
     * @param {RequestContext} ctx - The context object containing information about the request.
     * @param {Document} entity - The document entity associated with the event.
     * @param {BaseEntityEventType} type - The type of the event.
     * @param {IDocumentEventContext} context - The lifecycle phase of the event.
     * @param {DocumentInputTypes} [input] - Optional input data for the event.
     */
    constructor(ctx, entity, type, context = { phase: 'crud' }, input) {
        super(entity, type, ctx, input);
        this.context = context;
    }
}
exports.DocumentEvent = DocumentEvent;
//# sourceMappingURL=document.event.js.map