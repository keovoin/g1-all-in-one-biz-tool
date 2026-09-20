import * as i0 from "@angular/core";
/** One row of any suggestion popup (slash menu, mentions, emoji share this shape). */
export interface ISuggestionItem<T = unknown> {
    id: string;
    /** Already-translated display label. */
    label: string;
    /** Eva icon name (default pack) — or a FontAwesome class when `pack: 'fa'`. */
    icon?: string;
    pack?: 'eva' | 'fa';
    /** Literal glyph rendered instead of an icon (emoji). */
    glyph?: string;
    /** Already-translated group header (rows are grouped in given order). */
    group?: string;
    hint?: string;
    disabled?: boolean;
    /** Payload forwarded to the suggestion `command`. */
    data: T;
}
/**
 * Generic listbox rendered inside the shared suggestion overlay (spec 05 §6.4).
 * Keyboard state is driven imperatively by `SuggestionHostService` (the editor
 * keeps focus; `aria-activedescendant` points here).
 */
export declare class SuggestionListComponent {
    private readonly cdr;
    items: ISuggestionItem[];
    activeIndex: number;
    ariaLabel: string;
    emptyLabel: string;
    /** Set by the host; invoked with the chosen item. */
    onSelect: (item: ISuggestionItem) => void;
    setItems(items: ISuggestionItem[], emptyLabel: string, ariaLabel: string): void;
    isGroupStart(index: number): boolean;
    setActive(index: number): void;
    move(delta: number): void;
    select(index?: number): void;
    get activeDescendantId(): string | null;
    private scrollActiveIntoView;
    static ɵfac: i0.ɵɵFactoryDeclaration<SuggestionListComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<SuggestionListComponent, "gz-suggestion-list", never, {}, {}, never, never, true, never>;
}
