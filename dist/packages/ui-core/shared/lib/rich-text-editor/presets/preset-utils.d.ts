import { StarterKit } from '@tiptap/starter-kit';
/**
 * Shared Link configuration (05-editor-spec.md §3.3): links never navigate on click
 * inside the editor, plain URLs auto-link, and every link carries the hardened rel.
 * `target` is preserved through the extension's attribute passthrough so legacy
 * `<a target>` markup round-trips (§3.6).
 */
export declare const baseLinkConfiguration: {
    openOnClick: boolean;
    autolink: boolean;
    HTMLAttributes: {
        rel: string;
    };
};
/**
 * StarterKit option keys are the camelCase extension names (including the bundled
 * utility extensions `placeholder` / `characterCount` — 05-editor-spec.md §2.1:
 * "all individually configurable ... configured, not re-installed"). Typed loosely
 * here so preset factories can pass those utility keys without chasing the exact
 * option interface across 3.x minors; the values themselves follow the documented
 * v3 option shapes.
 */
export declare function configureStarterKit(options: Record<string, unknown>): ReturnType<typeof StarterKit.configure>;
/**
 * Image extended with `width`/`height` attributes so legacy CKEditor
 * `<img src alt width height>` markup round-trips losslessly (05-editor-spec.md §3.6).
 * Render-only — upload wiring is caller-provided and out of tier-1 scope.
 */
export declare const LegacyImage: import("@tiptap/core").Node<import("@tiptap/extension-image").ImageOptions, any>;
/**
 * Email-safe image: same attribute surface as {@link LegacyImage} but only parses
 * absolute `http(s)` sources — relative/blob/data URLs do not survive into an email
 * body (05-editor-spec.md §3.3, `email` preset "absolute URLs only").
 */
export declare const AbsoluteUrlImage: import("@tiptap/core").Node<import("@tiptap/extension-image").ImageOptions, any>;
