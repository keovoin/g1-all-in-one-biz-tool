import type { SuggestionProps } from '@tiptap/suggestion';
import { ISuggestionItem } from './suggestion-list.component';
import * as i0 from "@angular/core";
/**
 * Shared CDK-overlay popup host for every trigger-character popup — slash menu,
 * employee/document mentions and emoji share one implementation with three
 * configurations (spec 05 §6.4). Positioning uses `@floating-ui/dom`
 * (`bottom-start`, flip + shift) against the suggestion `clientRect`.
 */
export declare class SuggestionHostService {
    private readonly overlay;
    private readonly injector;
    private readonly translate;
    private overlayRef;
    private list;
    private clientRect;
    /** True while any suggestion popup is open (bubble menus suppress themselves). */
    get isOpen(): boolean;
    /** Id for `aria-activedescendant` on the editor host. */
    get activeDescendantId(): string | null;
    open(props: SuggestionProps<ISuggestionItem>, ariaLabelKey: string): void;
    update(props: SuggestionProps<ISuggestionItem>, ariaLabelKey: string): void;
    /** Forwarded suggestion keydown: ↑/↓ move, Enter/Tab select, Escape closes. */
    onKeyDown(event: KeyboardEvent): boolean;
    close(): void;
    private reposition;
    static ɵfac: i0.ɵɵFactoryDeclaration<SuggestionHostService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<SuggestionHostService>;
}
