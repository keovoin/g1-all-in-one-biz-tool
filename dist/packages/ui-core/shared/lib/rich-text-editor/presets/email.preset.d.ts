import type { PresetDefinition, RichTextEditorPresetOptions } from './preset.types';
/**
 * `email` preset (05-editor-spec.md §3.3): email-safe inline set for the
 * candidate-interview email composer. No code, no tables, no highlight, no task
 * lists. Headings 1–3, alignment serialized as inline `style="text-align: …"`
 * (email-safe), links restricted to absolute `http(s)`/`mailto` URLs, images
 * restricted to absolute URLs. Content produced here is never persisted to a DB
 * column, so it carries no legacy-coverage obligation.
 */
export declare function createEmailPreset(options?: RichTextEditorPresetOptions): PresetDefinition;
