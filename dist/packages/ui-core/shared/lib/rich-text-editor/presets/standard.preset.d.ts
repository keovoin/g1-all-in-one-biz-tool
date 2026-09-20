import type { PresetDefinition, RichTextEditorPresetOptions } from './preset.types';
/**
 * `standard` preset (05-editor-spec.md §3.3): the full legacy round-trip schema.
 * Headings parse at levels 1–6 (toolbar offers 1–3), text alignment, resizable
 * tables, task lists, images (render-only), highlight, sub/superscript, and
 * TextStyleKit (TextStyle + Color + FontFamily) for legacy font-span compatibility.
 *
 * Binding rule from 06-ckeditor-removal.md §3.1: any field that has ever stored
 * CKEditor HTML MUST use this preset so nothing is dropped on load.
 */
export declare function createStandardPreset(options?: RichTextEditorPresetOptions): PresetDefinition;
