import type { PresetDefinition, RichTextEditorPresetOptions } from './preset.types';
/**
 * `minimal` preset (05-editor-spec.md §3.3): StarterKit subset — marks
 * (bold/italic/underline/strike), inline code + plain code block, link, lists,
 * blockquote — plus the bundled Placeholder/CharacterCount utility extensions.
 * No headings, no horizontal rule, no tables/images/colors.
 *
 * Reserved for new, history-free fields; never wire it to a field that has ever
 * stored CKEditor HTML (that is `standard`'s job).
 */
export declare function createMinimalPreset(options?: RichTextEditorPresetOptions): PresetDefinition;
