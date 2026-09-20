import { Component, Input, ElementRef, ViewChild, inject, Injector, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiBridgeRegistryService } from './ui-bridge-registry.service';
import * as i0 from "@angular/core";
/**
 * Generic host component for rendering non-Angular framework components.
 *
 * This component acts as a bridge between Angular and other UI frameworks
 * (React, Vue, Svelte, etc.) by delegating mounting/unmounting to the
 * appropriate registered bridge.
 *
 * Supports:
 * - **Lazy bridges**: Async resolution via `UiBridgeRegistryService.getAsync()`
 * - **Lazy components**: `loadFrameworkComponent` for code-splitting
 * - **Error/retry**: Shows an error state with a retry button on load failure
 *
 * @example
 * ```html
 * <gz-framework-host
 *   frameworkId="react"
 *   [component]="MyReactComponent"
 *   [props]="{ title: 'Hello!' }"
 * />
 *
 * <!-- Lazy component -->
 * <gz-framework-host
 *   frameworkId="react"
 *   [loadComponent]="loadMyReactComponent"
 *   [props]="{ title: 'Lazy!' }"
 * />
 * ```
 */
export class FrameworkHostComponent {
    /**
     * Framework identifier (e.g., 'react', 'vue', 'svelte').
     * Must match a registered bridge in UiBridgeRegistryService.
     */
    frameworkId;
    /**
     * The framework component to render (eager).
     */
    component;
    /**
     * Lazy-load the framework component for code-splitting.
     * Mutually exclusive with `component` — if both set, `loadComponent` takes precedence.
     */
    loadComponent;
    /**
     * Props to pass to the framework component.
     */
    props;
    /**
     * Additional context to provide to the component.
     */
    context;
    hostRef;
    _bridgeRegistry = inject(UiBridgeRegistryService);
    _injector = inject(Injector);
    _cdr = inject(ChangeDetectorRef);
    _mountResult;
    /** Incremented on each _mount call to detect stale async completions. */
    _mountVersion = 0;
    /** Whether the component/bridge is currently loading. */
    _loading = false;
    /** Error message if loading failed. */
    _error = null;
    ngOnInit() {
        this._mount();
    }
    ngOnChanges(changes) {
        // Remount-triggering changes must be checked first — a simultaneous props
        // change should not short-circuit via the fast-path when the component
        // also needs a full remount (e.g. context changed at the same time).
        if (changes['component'] || changes['loadComponent'] || changes['frameworkId'] || changes['context']) {
            this._unmount();
            this._mount();
            return;
        }
        // Props-only fast-path: update in-place if the bridge supports it.
        if (changes['props'] && !changes['props'].firstChange) {
            if (this._mountResult?.updateProps) {
                this._mountResult.updateProps(this.props);
            }
        }
    }
    ngOnDestroy() {
        this._unmount();
    }
    /**
     * Retry mounting after a failure.
     */
    retry() {
        this._error = null;
        this._unmount();
        this._mount();
    }
    async _mount() {
        if (!this.frameworkId || (!this.component && !this.loadComponent)) {
            return;
        }
        const currentVersion = ++this._mountVersion;
        this._loading = true;
        this._error = null;
        this._cdr.markForCheck();
        try {
            // Resolve bridge (async — supports lazy bridges)
            const bridge = await this._bridgeRegistry.getAsync(this.frameworkId);
            // Abort if a newer mount was initiated while awaiting
            if (this._mountVersion !== currentVersion)
                return;
            if (!bridge) {
                const available = this._bridgeRegistry.getRegisteredFrameworks();
                const availableStr = available.length > 0 ? available.join(', ') : 'none';
                this._error =
                    `Bridge '${this.frameworkId}' not registered. ` +
                        `Available: ${availableStr}. ` +
                        `Make sure to import and provide the bridge.`;
                this._loading = false;
                this._cdr.markForCheck();
                return;
            }
            // Resolve component (lazy if loadComponent is provided)
            let resolvedComponent = this.component;
            if (this.loadComponent) {
                resolvedComponent = await this.loadComponent();
                // Abort if a newer mount was initiated while awaiting
                if (this._mountVersion !== currentVersion)
                    return;
            }
            if (!resolvedComponent) {
                this._error = `No component resolved for framework '${this.frameworkId}'.`;
                this._loading = false;
                this._cdr.markForCheck();
                return;
            }
            this._mountResult = bridge.mount({
                component: resolvedComponent,
                props: this.props,
                context: this.context,
                hostElement: this.hostRef.nativeElement,
                injector: this._injector
            });
            this._loading = false;
            this._cdr.markForCheck();
        }
        catch (error) {
            // Ignore errors from stale mount attempts
            if (this._mountVersion !== currentVersion)
                return;
            const message = error?.message ?? String(error);
            console.error(`[FrameworkHost] Failed to mount ${this.frameworkId} component:`, error);
            this._error = `Failed to load: ${message}`;
            this._loading = false;
            this._cdr.markForCheck();
        }
    }
    _unmount() {
        if (this._mountResult) {
            try {
                this._mountResult.unmount();
            }
            catch (error) {
                console.error(`[FrameworkHost] Failed to unmount ${this.frameworkId} component:`, error);
            }
            this._mountResult = undefined;
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: FrameworkHostComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: FrameworkHostComponent, isStandalone: true, selector: "gz-framework-host", inputs: { frameworkId: "frameworkId", component: "component", loadComponent: "loadComponent", props: "props", context: "context" }, viewQueries: [{ propertyName: "hostRef", first: true, predicate: ["host"], descendants: true, static: true }], usesOnChanges: true, ngImport: i0, template: `
		@if (_loading) {
			<div class="framework-host-loading">Loading…</div>
		} @else if (_error) {
			<div class="framework-host-error">
				<span>{{ _error }}</span>
				<button (click)="retry()">Retry</button>
			</div>
		}
		<div #host class="framework-host"></div>
	`, isInline: true, styles: [":host{display:contents}.framework-host{display:contents}.framework-host-loading{padding:1rem;text-align:center;color:var(--text-hint-color, #8f9bb3);font-size:.875rem}.framework-host-error{padding:1rem;text-align:center;color:var(--color-danger-500, #ff3d71);font-size:.875rem;display:flex;align-items:center;justify-content:center;gap:.5rem}.framework-host-error button{padding:.25rem .75rem;border:1px solid var(--color-danger-500, #ff3d71);border-radius:4px;background:transparent;color:var(--color-danger-500, #ff3d71);cursor:pointer;font-size:.75rem}.framework-host-error button:hover{background:var(--color-danger-500, #ff3d71);color:#fff}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: FrameworkHostComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-framework-host', standalone: true, imports: [CommonModule], template: `
		@if (_loading) {
			<div class="framework-host-loading">Loading…</div>
		} @else if (_error) {
			<div class="framework-host-error">
				<span>{{ _error }}</span>
				<button (click)="retry()">Retry</button>
			</div>
		}
		<div #host class="framework-host"></div>
	`, changeDetection: ChangeDetectionStrategy.OnPush, styles: [":host{display:contents}.framework-host{display:contents}.framework-host-loading{padding:1rem;text-align:center;color:var(--text-hint-color, #8f9bb3);font-size:.875rem}.framework-host-error{padding:1rem;text-align:center;color:var(--color-danger-500, #ff3d71);font-size:.875rem;display:flex;align-items:center;justify-content:center;gap:.5rem}.framework-host-error button{padding:.25rem .75rem;border:1px solid var(--color-danger-500, #ff3d71);border-radius:4px;background:transparent;color:var(--color-danger-500, #ff3d71);cursor:pointer;font-size:.75rem}.framework-host-error button:hover{background:var(--color-danger-500, #ff3d71);color:#fff}\n"] }]
        }], propDecorators: { frameworkId: [{
                type: Input,
                args: [{ required: true }]
            }], component: [{
                type: Input
            }], loadComponent: [{
                type: Input
            }], props: [{
                type: Input
            }], context: [{
                type: Input
            }], hostRef: [{
                type: ViewChild,
                args: ['host', { static: true }]
            }] } });
//# sourceMappingURL=framework-host.component.js.map