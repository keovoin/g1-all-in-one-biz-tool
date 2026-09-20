import { Injector } from '@angular/core';
import { SuggestionHostService } from './suggestion-host.service';
export interface IMentionAttrs {
    id: string;
    label: string;
}
/**
 * Employee mentions (`@`) — spec 05 §7.1. Org-scoped employee lookup through the
 * existing `EmployeesService` (org list cached per editor session, filtered
 * locally; 250 ms debounce + in-flight sequence guard so stale responses never
 * render). The editor never calls a notification API — ids collected from the
 * doc are sent as `mentionEmployeeIds` on every content save.
 */
export declare function createEmployeeMention(injector: Injector, host: SuggestionHostService): import("@tiptap/core").Node<import("@tiptap/extension-mention").MentionOptions<any, import("@tiptap/extension-mention").MentionNodeAttrs>, any>;
/** Walks a TipTap JSON doc collecting distinct employee-mention ids (save DTO contract, spec 05 §7.1). */
export declare function collectEmployeeMentionIds(contentJson: unknown): string[];
