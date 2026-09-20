import { ApplicationRef, Directive, EnvironmentInjector, NgZone, createComponent, input } from '@angular/core';
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
export class AngularNodeViewComponent {
    constructor() {
        /** Current ProseMirror node (patched on every same-type update). */
        this.node = input.required(...(ngDevMode ? [{ debugName: "node" }] : []));
        /** The owning TipTap editor. */
        this.editor = input.required(...(ngDevMode ? [{ debugName: "editor" }] : []));
        /** True while the node is node-selected. */
        this.selected = input(false, ...(ngDevMode ? [{ debugName: "selected" }] : []));
        /** Resolves the node's current position in the doc. */
        this.getPos = input(() => undefined, ...(ngDevMode ? [{ debugName: "getPos" }] : []));
        /** Merges the given attrs into the node (single transaction). */
        this.updateAttributes = input(() => void 0, ...(ngDevMode ? [{ debugName: "updateAttributes" }] : []));
        /** Deletes the node from the doc. */
        this.deleteNode = input(() => void 0, ...(ngDevMode ? [{ debugName: "deleteNode" }] : []));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AngularNodeViewComponent, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "17.1.0", version: "21.0.7", type: AngularNodeViewComponent, isStandalone: true, inputs: { node: { classPropertyName: "node", publicName: "node", isSignal: true, isRequired: true, transformFunction: null }, editor: { classPropertyName: "editor", publicName: "editor", isSignal: true, isRequired: true, transformFunction: null }, selected: { classPropertyName: "selected", publicName: "selected", isSignal: true, isRequired: false, transformFunction: null }, getPos: { classPropertyName: "getPos", publicName: "getPos", isSignal: true, isRequired: false, transformFunction: null }, updateAttributes: { classPropertyName: "updateAttributes", publicName: "updateAttributes", isSignal: true, isRequired: false, transformFunction: null }, deleteNode: { classPropertyName: "deleteNode", publicName: "deleteNode", isSignal: true, isRequired: false, transformFunction: null } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AngularNodeViewComponent, decorators: [{
            type: Directive
        }], propDecorators: { node: [{ type: i0.Input, args: [{ isSignal: true, alias: "node", required: true }] }], editor: [{ type: i0.Input, args: [{ isSignal: true, alias: "editor", required: true }] }], selected: [{ type: i0.Input, args: [{ isSignal: true, alias: "selected", required: false }] }], getPos: [{ type: i0.Input, args: [{ isSignal: true, alias: "getPos", required: false }] }], updateAttributes: [{ type: i0.Input, args: [{ isSignal: true, alias: "updateAttributes", required: false }] }], deleteNode: [{ type: i0.Input, args: [{ isSignal: true, alias: "deleteNode", required: false }] }] } });
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
export function AngularNodeViewRenderer(component, options) {
    return (props) => {
        const injector = options.injector;
        const appRef = injector.get(ApplicationRef);
        const environmentInjector = injector.get(EnvironmentInjector);
        const zone = injector.get(NgZone);
        let currentNode = props.node;
        const componentRef = zone.run(() => createComponent(component, { environmentInjector, elementInjector: injector }));
        const getPos = () => {
            const pos = props.getPos();
            return typeof pos === 'number' ? pos : undefined;
        };
        const updateAttributes = (attrs) => {
            const pos = getPos();
            if (pos === undefined)
                return;
            const { view } = props.editor;
            view.dispatch(view.state.tr.setNodeMarkup(pos, undefined, { ...currentNode.attrs, ...attrs }));
        };
        const deleteNode = () => {
            const pos = getPos();
            if (pos === undefined)
                return;
            const { view } = props.editor;
            view.dispatch(view.state.tr.delete(pos, pos + currentNode.nodeSize));
        };
        zone.run(() => {
            componentRef.setInput('node', currentNode);
            componentRef.setInput('editor', props.editor);
            componentRef.setInput('selected', false);
            componentRef.setInput('getPos', getPos);
            componentRef.setInput('updateAttributes', updateAttributes);
            componentRef.setInput('deleteNode', deleteNode);
            appRef.attachView(componentRef.hostView);
            componentRef.changeDetectorRef.detectChanges();
        });
        const dom = componentRef.location.nativeElement;
        if (currentNode.type.spec.draggable && currentNode.type.spec.atom) {
            // Same as `setAttribute('data-drag-handle', '')` — ProseMirror only tests
            // for the attribute's presence.
            dom.dataset.dragHandle = '';
        }
        const contentDOM = currentNode.isLeaf
            ? null
            : dom.querySelector('[data-node-view-content]');
        return {
            dom,
            contentDOM: contentDOM ?? undefined,
            update: (node) => {
                if (node.type !== currentNode.type)
                    return false;
                currentNode = node;
                zone.run(() => {
                    componentRef.setInput('node', node);
                    componentRef.changeDetectorRef.detectChanges();
                });
                return true;
            },
            selectNode: () => {
                zone.run(() => {
                    componentRef.setInput('selected', true);
                    componentRef.changeDetectorRef.detectChanges();
                });
                dom.classList.add('gz-node-view--selected');
            },
            deselectNode: () => {
                zone.run(() => {
                    componentRef.setInput('selected', false);
                    componentRef.changeDetectorRef.detectChanges();
                });
                dom.classList.remove('gz-node-view--selected');
            },
            // Let interactive controls inside the node view handle their own events.
            stopEvent: (event) => {
                const target = event.target;
                return !!target?.closest('button, a, input, select, textarea, [data-node-view-interactive]');
            },
            // Ignore mutations outside the content hole (Angular re-renders chrome freely).
            ignoreMutation: (mutation) => {
                if (mutation.type === 'selection')
                    return false;
                return !contentDOM || !contentDOM.contains(mutation.target);
            },
            destroy: () => {
                zone.run(() => {
                    appRef.detachView(componentRef.hostView);
                    componentRef.destroy();
                });
            }
        };
    };
}
//# sourceMappingURL=angular-node-view-renderer.js.map