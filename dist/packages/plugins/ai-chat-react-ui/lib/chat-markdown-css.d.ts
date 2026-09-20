/**
 * Typography for markdown streamed by `streamdown`.
 *
 * Streamdown tags every node it emits with Tailwind class names; Gauzy ships no Tailwind, so
 * those classes resolve to nothing and every element would fall back to UA defaults — 2em bold
 * headings, 40px list indents, unstyled code cards. This sheet is that missing typography, sized
 * in `em` so it scales with the message text and toned with `color-mix` against `currentColor`
 * so it follows whichever Nebular theme is active.
 *
 * Exported as a string rather than a component because the hosts that render markdown (the chat
 * panel, the playground) each already inject one `<style>` block: they interpolate this into it,
 * so the rules exist once per host instead of once per message.
 */
export declare const chatMarkdownCss: string;
