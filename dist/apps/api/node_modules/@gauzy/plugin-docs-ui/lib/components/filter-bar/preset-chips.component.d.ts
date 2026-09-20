import { EventEmitter } from '@angular/core';
import { DocsPresetCounts } from '../../+state/documents.store';
import { DocsPresetId } from '../../models/docs-filter.model';
import * as i0 from "@angular/core";
interface IPresetChip {
    id: DocsPresetId | null;
    labelKey: string;
    countKey: keyof DocsPresetCounts;
}
/**
 * Preset chips with live facet counts: All / Needs review / Not in AI
 * knowledge / Archived. Toggling the active preset returns to All.
 */
export declare class PresetChipsComponent {
    counts: DocsPresetCounts | null;
    active: DocsPresetId | undefined;
    presetToggled: EventEmitter<DocsPresetId>;
    readonly chips: IPresetChip[];
    isActive(chip: IPresetChip): boolean;
    toggle(chip: IPresetChip): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<PresetChipsComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PresetChipsComponent, "gz-docs-preset-chips", never, { "counts": { "alias": "counts"; "required": false; }; "active": { "alias": "active"; "required": false; }; }, { "presetToggled": "presetToggled"; }, never, never, false, never>;
}
export {};
