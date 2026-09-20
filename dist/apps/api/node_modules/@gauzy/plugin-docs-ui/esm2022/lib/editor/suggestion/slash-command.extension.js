import { Extension } from '@tiptap/core';
import { PluginKey } from '@tiptap/pm/state';
import Suggestion from '@tiptap/suggestion';
import { filterSlashCommands } from './slash-menu.items';
export const slashSuggestionPluginKey = new PluginKey('gzSlashCommand');
/**
 * Slash-command menu: `@tiptap/suggestion` with char `/` rendered through the
 * shared `SuggestionHostService` popup (spec 05 §6.4). Backspacing past the `/`
 * closes the menu (built into the suggestion plugin).
 */
export function createSlashCommandExtension(deps) {
    return Extension.create({
        name: 'slashCommand',
        addProseMirrorPlugins() {
            return [
                Suggestion({
                    editor: this.editor,
                    pluginKey: slashSuggestionPluginKey,
                    char: '/',
                    startOfLine: false,
                    allowSpaces: false,
                    items: ({ query }) => filterSlashCommands(query, deps.translate, deps.commandDeps),
                    command: ({ editor, range, props }) => {
                        props.data.command.action(editor, range, props.data.deps);
                    },
                    render: () => ({
                        onStart: (props) => deps.host.open(props, 'DOCS.EDITOR.SLASH.ARIA_LABEL'),
                        onUpdate: (props) => deps.host.update(props, 'DOCS.EDITOR.SLASH.ARIA_LABEL'),
                        onKeyDown: ({ event }) => deps.host.onKeyDown(event),
                        onExit: () => deps.host.close()
                    })
                })
            ];
        }
    });
}
//# sourceMappingURL=slash-command.extension.js.map