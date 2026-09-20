import type { UIMessageStreamWriter } from 'ai';
import type { AiChatDataPartWriter } from './tool-registry';
/** The buffering writer handed to tool factories, plus the engine-side binding controls. */
export interface IDeferredDataPartWriter {
    /** The `writeData` implementation to put on `IAiChatToolContext`. */
    readonly write: AiChatDataPartWriter;
    /** Attaches the real stream writer and flushes anything written before it existed. */
    bind(writer: UIMessageStreamWriter): void;
    /** Detaches the stream writer — later writes are dropped instead of thrown into a closed stream. */
    release(): void;
}
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
export declare function createDeferredDataPartWriter(): IDeferredDataPartWriter;
