import { Injector, Type } from '@angular/core';
import { Editor, NodeViewRenderer } from '@tiptap/core';
import { Node as ProseMirrorNode } from '@tiptap/pm/model';
import * as i0 from "@angular/core";
/**
 * Minimal in-house Angular ↔ ProseMirror node-view bridge (spec 05 §6.3).
 *
 * Tier 1 (`packages/ui-core/shared/.../rich-text-editor/node-view/`) will host the
 * canonical copy once it lands; until then the editor chunk carries this local one.
 * `createComponent()` + `ApplicationRef.attachView` — no third-party Angular binding.
 */
/**
 * Abstract base for node-view components: `node`, `selected`, `editor`,
 * `getPos`, `updateAttributes`, `deleteNode` arrive as signal inputs so
 * OnPush components stay consistent (spec 05 §6.3). Decorated with a
 * selector-less `@Directive()` so the inherited signal inputs compile.
 */
export declare abstract class AngularNodeViewComponent {
    /** Current ProseMirror node (patched on every same-type update). */
    readonly node: import("@angular/core").InputSignal<ProseMirrorNode>;
    /** The owning TipTap editor. */
    readonly editor: import("@angular/core").InputSignal<Editor>;
    /** True while the node is node-selected. */
    readonly selected: import("@angular/core").InputSignal<boolean>;
    /** Resolves the node's current position in the doc. */
    readonly getPos: import("@angular/core").InputSignal<() => number | undefined>;
    /** Merges the given attrs into the node (single transaction). */
    readonly updateAttributes: import("@angular/core").InputSignal<(attrs: Record<string, unknown>) => void>;
    /** Deletes the node from the doc. */
    readonly deleteNode: import("@angular/core").InputSignal<() => void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<AngularNodeViewComponent, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<AngularNodeViewComponent, never, never, { "node": { "alias": "node"; "required": true; "isSignal": true; }; "editor": { "alias": "editor"; "required": true; "isSignal": true; }; "selected": { "alias": "selected"; "required": false; "isSignal": true; }; "getPos": { "alias": "getPos"; "required": false; "isSignal": true; }; "updateAttributes": { "alias": "updateAttributes"; "required": false; "isSignal": true; }; "deleteNode": { "alias": "deleteNode"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}
export interface IAngularNodeViewRendererOptions {
    /** Injector of the editor component (provides ApplicationRef, NgZone, services). */
    injector: Injector;
}
/**
 * Returns a ProseMirror `NodeView` factory rendering the given Angular component.
 *
 * - `update(node)` patches the `node` input and returns true for same-type updates
 *   (no re-mount).
 * - An optional content hole is exposed through a `[data-node-view-content]`
 *   element in the component template (used by `callout`).
 * - Draggable atoms get `data-drag-handle` on the host so ProseMirror initiates
 *   drags from the whole card.
 * - The component is created/destroyed inside the zone; ProseMirror-driven DOM
 *   mutation stays outside (spec 05 §6.3).
 */
export declare function AngularNodeViewRenderer<T extends AngularNodeViewComponent>(component: Type<T>, options: IAngularNodeViewRendererOptions): NodeViewRenderer;
