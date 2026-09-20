import { Node } from '@tiptap/core';
export type CalloutType = 'info' | 'success' | 'warning' | 'danger';
export interface ICalloutAttributes {
    type: CalloutType;
    /** Optional emoji override for the default status icon. */
    emoji: string | null;
}
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        callout: {
            /** Wraps the current block in a callout of the given type. */
            setCallout: (attributes?: Partial<ICalloutAttributes>) => ReturnType;
            /** Lifts the content back out of the callout. */
            unsetCallout: () => ReturnType;
        };
    }
}
/**
 * `callout` custom node (spec 05 §6.2): block container with a status type and
 * an optional emoji override. Plain `renderHTML`/`parseHTML` keep it renderable
 * by `@tiptap/static-renderer` without Angular; the interactive node view is
 * attached in `document-extensions.ts`.
 */
export declare const Callout: Node<any, any>;
