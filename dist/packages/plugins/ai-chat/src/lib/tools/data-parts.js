"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDeferredDataPartWriter = createDeferredDataPartWriter;
const common_1 = require("@nestjs/common");
/** How many parts are buffered before a writer is bound (a runaway contribution must not grow forever). */
const MAX_BUFFERED_PARTS = 64;
/**
 * A `writeData` implementation whose stream writer only exists LATER.
 *
 * The ordering problem this solves: tool factories are resolved before `createUIMessageStream`
 * runs, because the resolved tool map is an input to `streamText` — but the
 * `UIMessageStreamWriter` a factory needs is only produced inside that stream's `execute`
 * callback. Handing factories a buffering writer up front, and binding the real one the moment
 * the stream opens, keeps the contribution API a plain synchronous call.
 *
 * Every write is failure-isolated: a data part is decoration around the answer, so a bad part
 * (or a stream that has already ended) is logged and dropped rather than failing the chat turn.
 *
 * @returns The writer to hand out plus its `bind`/`release` controls.
 */
function createDeferredDataPartWriter() {
    const logger = new common_1.Logger('AiChatDataParts');
    let writer;
    let buffered = [];
    let released = false;
    /** Pushes one part at the real writer, converting any failure into a warning. */
    const emit = (part) => {
        if (!writer)
            return;
        try {
            writer.write(part);
        }
        catch (error) {
            logger.warn(`Dropped data part '${part?.type}': ${error instanceof Error ? error.message : error}`);
        }
    };
    const write = (part) => {
        // A `data-` prefix is what makes the AI SDK route this into `message.parts` client-side;
        // anything else would be dropped downstream with no diagnostic, so refuse it here.
        if (!part || typeof part.type !== 'string' || !part.type.startsWith('data-')) {
            logger.warn(`Ignored a data part with an invalid type: ${String(part?.type)}`);
            return;
        }
        if (released) {
            // The stream is finished — writing would throw into a closed controller.
            logger.debug(`Data part '${part.type}' arrived after the stream ended — dropped.`);
            return;
        }
        if (!writer) {
            if (buffered.length >= MAX_BUFFERED_PARTS) {
                logger.warn(`Data-part buffer is full (${MAX_BUFFERED_PARTS}) — dropped '${part.type}'.`);
                return;
            }
            buffered.push(part);
            return;
        }
        emit(part);
    };
    return {
        write,
        bind(streamWriter) {
            writer = streamWriter;
            released = false;
            const pending = buffered;
            buffered = [];
            for (const part of pending) {
                emit(part);
            }
        },
        release() {
            released = true;
            writer = undefined;
            buffered = [];
        }
    };
}
//# sourceMappingURL=data-parts.js.map