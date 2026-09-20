export * from './preset.types';
/**
 * Preset factory (05-editor-spec.md §3.3 / §12): resolves the extension set and
 * toolbar layout for a preset. Each preset lives in its own module and is loaded
 * through a dynamic import so it compiles into its own lazy chunk — dialogs that
 * use only `minimal` never pay for tables/images.
 */
export async function createEditorExtensions(preset, options = {}) {
    switch (preset) {
        case 'minimal':
            return (await import('./minimal.preset')).createMinimalPreset(options);
        case 'email':
            return (await import('./email.preset')).createEmailPreset(options);
        case 'standard':
        default:
            return (await import('./standard.preset')).createStandardPreset(options);
    }
}
//# sourceMappingURL=index.js.map