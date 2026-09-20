import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, ElementRef, inject, Injector, Input, ViewContainerRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { concatMap, from } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NbCardModule } from '@nebular/theme';
import { PageExtensionRegistryService } from './page-extension-registry.service';
import { FrameworkHostComponent } from '../ui-bridge/framework-host.component';
import { isFrameworkExtension } from '../ui-bridge/framework-extension.helper';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@nebular/theme";
/**
 * Renders all extensions registered for a given slot with reactive updates.
 *
 * Features:
 * - **Reactive**: Automatically updates when extensions are registered/unregistered
 * - **Lifecycle Hooks**: Calls onMount, onUnmount, onActivate, onDeactivate
 * - **Visibility Control**: Filters extensions based on permissions/features
 * - **Wrappers**: Supports built-in wrappers (card, widget, window, panel)
 * - **Multi-framework**: Auto-detects framework extensions and renders via `<gz-framework-host>`
 * - **Error/retry**: Shows error state with retry button on lazy load failure
 *
 * @example
 * ```html
 * <!-- Basic usage -->
 * <ga-page-extension-slot slotId="dashboard-widgets"></ga-page-extension-slot>
 *
 * <!-- With visibility context -->
 * <ga-page-extension-slot
 *   [slotId]="PAGE_EXTENSION_SLOTS.DASHBOARD_WIDGETS"
 *   [visibilityContext]="{ user: currentUser, organization: org }"
 * ></ga-page-extension-slot>
 *
 * <!-- With wrapper override -->
 * <ga-page-extension-slot
 *   slotId="dashboard-widgets"
 *   defaultWrapper="card"
 * ></ga-page-extension-slot>
 * ```
 */
export class PageExtensionSlotComponent {
    _extensionRegistry = inject(PageExtensionRegistryService);
    _injector = inject(Injector);
    _cdr = inject(ChangeDetectorRef);
    _destroyRef = inject(DestroyRef);
    _viewContainerRef = inject(ViewContainerRef);
    _elementRef = inject(ElementRef);
    /** Tracks pending async cleanup to serialize mount/unmount operations. */
    _pendingCleanup = Promise.resolve();
    /** Active extension subscription — cancelled before re-subscribing to avoid leaks. */
    _extensionSub;
    /**
     * The slot identifier to render extensions for.
     * Use PAGE_EXTENSION_SLOTS constants for well-known slots.
     */
    slotId;
    /**
     * Optional CSS class to apply to each extension container.
     */
    extensionClass;
    /**
     * Default wrapper for extensions that don't specify one.
     */
    defaultWrapper;
    /**
     * Context for visibility checks (user, organization, etc.).
     */
    visibilityContext;
    /**
     * Additional data to pass to extensions via lifecycle context.
     */
    contextData;
    /**
     * Whether to use reactive updates (default: true).
     * Set to false for static extension loading.
     */
    reactive = true;
    /**
     * Mounted extensions with their component refs.
     */
    _mountedExtensions = [];
    ngOnInit() {
        this._subscribeToExtensions();
    }
    ngOnChanges(changes) {
        if (changes['slotId'] && !changes['slotId'].firstChange) {
            this._pendingCleanup = this._unmountAll().then(() => {
                this._subscribeToExtensions();
            });
        }
        if (changes['visibilityContext'] && !changes['visibilityContext'].firstChange) {
            this._pendingCleanup = this._pendingCleanup.then(() => this._refreshVisibility());
        }
    }
    ngOnDestroy() {
        this._unmountAll();
    }
    /**
     * Retry loading a failed extension.
     */
    async retryExtension(mounted) {
        mounted.error = undefined;
        mounted.loading = true;
        this._cdr.markForCheck();
        // Re-attempt lazy loading
        if (mounted.isFramework) {
            // For framework extensions, the FrameworkHostComponent handles retry
            // Just clear the error and let it re-render
            mounted.loading = false;
            this._cdr.markForCheck();
        }
        else {
            await this._resolveLazyComponent(mounted);
        }
    }
    /**
     * Subscribes to extension changes for reactive updates.
     */
    _subscribeToExtensions() {
        if (!this.slotId)
            return;
        // Cancel previous subscription to avoid leaks when slotId changes
        this._extensionSub?.unsubscribe();
        if (this.reactive) {
            // Reactive mode: Subscribe to extension changes
            this._extensionSub = this._extensionRegistry
                .getExtensions$(this.slotId)
                .pipe(concatMap((extensions) => from(this._updateExtensions(extensions))), takeUntilDestroyed(this._destroyRef))
                .subscribe();
        }
        else {
            // Static mode: Load once
            const extensions = this._extensionRegistry.getExtensions(this.slotId);
            this._updateExtensions(extensions);
        }
    }
    /**
     * Updates the mounted extensions based on the new list.
     */
    async _updateExtensions(extensions) {
        // Filter visible extensions
        const visibleExtensions = await this._filterVisibleExtensions(extensions);
        // Find extensions to unmount (removed)
        const toUnmount = this._mountedExtensions.filter((m) => !visibleExtensions.find((e) => e.id === m.extension.id));
        // Find extensions to mount (new)
        const toMount = visibleExtensions.filter((e) => !this._mountedExtensions.find((m) => m.extension.id === e.id));
        // Unmount removed extensions
        for (const mounted of toUnmount) {
            await this._unmountExtension(mounted);
        }
        // Remove unmounted from list
        this._mountedExtensions = this._mountedExtensions.filter((m) => !toUnmount.includes(m));
        // Mount new extensions
        for (const ext of toMount) {
            await this._mountExtension(ext);
        }
        // Sort by order
        this._mountedExtensions.sort((a, b) => (a.extension.order ?? 999) - (b.extension.order ?? 999));
        this._cdr.markForCheck();
    }
    /**
     * Filters extensions based on visibility rules.
     * Delegates to the registry's full visibility check which handles
     * permissions, permissionsAny, featureKey, hidden flag, and custom visible callbacks.
     */
    async _filterVisibleExtensions(_extensions) {
        const context = {
            user: this.visibilityContext?.user,
            organization: this.visibilityContext?.organization,
            data: { ...this.visibilityContext?.data, ...this.contextData }
        };
        return this._extensionRegistry.getVisibleExtensions(this.slotId, context);
    }
    /**
     * Mounts an extension and calls onMount lifecycle hook.
     * Detects framework extensions and sets up accordingly.
     * If the extension uses `loadComponent`, resolves it lazily before rendering.
     */
    async _mountExtension(extension) {
        const framework = isFrameworkExtension(extension);
        const hasLazyComponent = !framework && !!extension.loadComponent;
        // For framework extensions, extract the component and loader
        let resolvedFrameworkComponent;
        let loadFrameworkComponent;
        if (framework) {
            const fwExt = extension;
            resolvedFrameworkComponent = fwExt.frameworkComponent;
            loadFrameworkComponent = fwExt.loadFrameworkComponent;
        }
        const mounted = {
            extension,
            resolvedComponent: hasLazyComponent ? undefined : extension.component,
            loading: hasLazyComponent,
            mounted: true,
            isFramework: framework,
            resolvedFrameworkComponent,
            loadFrameworkComponent
        };
        this._mountedExtensions.push(mounted);
        // Resolve lazy Angular component
        if (hasLazyComponent && extension.loadComponent) {
            await this._resolveLazyComponent(mounted);
        }
        // Call onMount lifecycle hook
        if (extension.onMount) {
            const context = this._createLifecycleContext(extension);
            try {
                await extension.onMount(context);
            }
            catch (error) {
                console.error(`[ExtensionSlot] onMount error for '${extension.id}':`, error);
            }
        }
    }
    /**
     * Resolves a lazy Angular component for a mounted extension.
     * Sets error state on failure for retry support.
     */
    async _resolveLazyComponent(mounted) {
        try {
            mounted.resolvedComponent = await mounted.extension.loadComponent();
            mounted.loading = false;
            mounted.error = undefined;
            this._cdr.markForCheck();
        }
        catch (error) {
            const message = error?.message ?? String(error);
            console.error(`[ExtensionSlot] loadComponent failed for '${mounted.extension.id}':`, error);
            mounted.loading = false;
            mounted.error = message;
            this._cdr.markForCheck();
        }
    }
    /**
     * Unmounts an extension and calls onUnmount lifecycle hook.
     */
    async _unmountExtension(mounted) {
        mounted.mounted = false;
        // Call onUnmount lifecycle hook
        if (mounted.extension.onUnmount) {
            const context = this._createLifecycleContext(mounted.extension);
            try {
                await mounted.extension.onUnmount(context);
            }
            catch (error) {
                console.error(`[ExtensionSlot] onUnmount error for '${mounted.extension.id}':`, error);
            }
        }
        // Destroy component ref if exists
        if (mounted.componentRef) {
            mounted.componentRef.destroy();
            mounted.componentRef = undefined;
        }
    }
    /**
     * Unmounts all extensions.
     */
    async _unmountAll() {
        for (const mounted of this._mountedExtensions) {
            await this._unmountExtension(mounted);
        }
        this._mountedExtensions = [];
    }
    /**
     * Refreshes visibility for all mounted extensions.
     */
    async _refreshVisibility() {
        const extensions = this._extensionRegistry.getExtensions(this.slotId);
        await this._updateExtensions(extensions);
    }
    /**
     * Creates a lifecycle context for an extension.
     */
    _createLifecycleContext(extension) {
        return {
            injector: this._injector,
            extension,
            slotId: this.slotId,
            data: { ...this.visibilityContext?.data, ...this.contextData }
        };
    }
    /**
     * Gets the wrapper type for an extension.
     */
    getWrapperType(extension) {
        if (!extension.wrapper) {
            return this.defaultWrapper ?? 'none';
        }
        if (typeof extension.wrapper === 'string') {
            return extension.wrapper;
        }
        if (extension.wrapper.type === 'custom') {
            if (extension.wrapper.component) {
                return 'custom';
            }
            console.warn(`[ExtensionSlot] Extension '${extension.id}' uses wrapper type 'custom' but no component was provided. Falling back to 'none'.`);
            return 'none';
        }
        return extension.wrapper.type;
    }
    /**
     * Gets the wrapper config for an extension.
     */
    getWrapperConfig(extension) {
        if (!extension.wrapper || typeof extension.wrapper === 'string') {
            return undefined;
        }
        return extension.wrapper;
    }
    /**
     * Builds inputs for a custom wrapper component.
     * Passes the extension's resolved component and config so the wrapper can render the content.
     */
    getCustomWrapperInputs(mounted) {
        return {
            ...(mounted.extension.config ?? {}),
            extensionComponent: mounted.resolvedComponent,
            extensionConfig: mounted.extension.config,
            extension: mounted.extension
        };
    }
    /**
     * Activates an extension (calls onActivate hook).
     * Call this when a tab is selected, for example.
     */
    async activateExtension(extensionId) {
        const mounted = this._mountedExtensions.find((m) => m.extension.id === extensionId);
        if (mounted?.extension.onActivate) {
            const context = this._createLifecycleContext(mounted.extension);
            await mounted.extension.onActivate(context);
        }
    }
    /**
     * Deactivates an extension (calls onDeactivate hook).
     */
    async deactivateExtension(extensionId) {
        const mounted = this._mountedExtensions.find((m) => m.extension.id === extensionId);
        if (mounted?.extension.onDeactivate) {
            const context = this._createLifecycleContext(mounted.extension);
            await mounted.extension.onDeactivate(context);
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PageExtensionSlotComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: PageExtensionSlotComponent, isStandalone: true, selector: "ga-page-extension-slot", inputs: { slotId: "slotId", extensionClass: "extensionClass", defaultWrapper: "defaultWrapper", visibilityContext: "visibilityContext", contextData: "contextData", reactive: "reactive" }, usesOnChanges: true, ngImport: i0, template: `
		@for (mounted of _mountedExtensions; track mounted.extension.id) {
			@if (mounted.mounted) {
				<div
					class="extension-container"
					[class]="extensionClass"
					[attr.data-extension-id]="mounted.extension.id"
					[attr.data-framework]="mounted.extension.frameworkId"
				>
					@if (mounted.loading) {
						<div class="extension-loading">Loading…</div>
					} @else if (mounted.error) {
						<div class="extension-error">
							<span>Failed to load "{{ mounted.extension.id }}"</span>
							<button (click)="retryExtension(mounted)">Retry</button>
						</div>
					} @else if (mounted.isFramework) {
						<!-- Framework extension: delegate to gz-framework-host -->
						@switch (getWrapperType(mounted.extension)) {
							@case ('card') {
								<nb-card>
									@if (getWrapperConfig(mounted.extension)?.showHeader !== false) {
										<nb-card-header>
											{{
												getWrapperConfig(mounted.extension)?.title ||
													mounted.extension.metadata?.title ||
													mounted.extension.id
											}}
										</nb-card-header>
									}
									<nb-card-body>
										<gz-framework-host
											[frameworkId]="mounted.extension.frameworkId!"
											[component]="mounted.resolvedFrameworkComponent"
											[loadComponent]="mounted.loadFrameworkComponent"
											[props]="$any(mounted.extension.config)?.props"
											[context]="$any(mounted.extension.config)?.context"
										/>
									</nb-card-body>
								</nb-card>
							}
							@case ('widget') {
								<nb-card class="extension-widget">
									<nb-card-body>
										<gz-framework-host
											[frameworkId]="mounted.extension.frameworkId!"
											[component]="mounted.resolvedFrameworkComponent"
											[loadComponent]="mounted.loadFrameworkComponent"
											[props]="$any(mounted.extension.config)?.props"
											[context]="$any(mounted.extension.config)?.context"
										/>
									</nb-card-body>
								</nb-card>
							}
							@case ('window') {
								<nb-card class="extension-window">
									@if (getWrapperConfig(mounted.extension)?.showHeader !== false) {
										<nb-card-header>
											{{
												getWrapperConfig(mounted.extension)?.title ||
													mounted.extension.metadata?.title ||
													mounted.extension.id
											}}
										</nb-card-header>
									}
									<nb-card-body>
										<gz-framework-host
											[frameworkId]="mounted.extension.frameworkId!"
											[component]="mounted.resolvedFrameworkComponent"
											[loadComponent]="mounted.loadFrameworkComponent"
											[props]="$any(mounted.extension.config)?.props"
											[context]="$any(mounted.extension.config)?.context"
										/>
									</nb-card-body>
								</nb-card>
							}
							@case ('panel') {
								<div class="extension-panel" [class]="getWrapperConfig(mounted.extension)?.cssClass">
									@if (
										getWrapperConfig(mounted.extension)?.showHeader !== false &&
										getWrapperConfig(mounted.extension)?.title
									) {
										<div class="extension-panel-header">
											{{ getWrapperConfig(mounted.extension)?.title }}
										</div>
									}
									<div class="extension-panel-body">
										<gz-framework-host
											[frameworkId]="mounted.extension.frameworkId!"
											[component]="mounted.resolvedFrameworkComponent"
											[loadComponent]="mounted.loadFrameworkComponent"
											[props]="$any(mounted.extension.config)?.props"
											[context]="$any(mounted.extension.config)?.context"
										/>
									</div>
								</div>
							}
							@default {
								<gz-framework-host
									[frameworkId]="mounted.extension.frameworkId!"
									[component]="mounted.resolvedFrameworkComponent"
									[loadComponent]="mounted.loadFrameworkComponent"
									[props]="$any(mounted.extension.config)?.props"
									[context]="$any(mounted.extension.config)?.context"
								/>
							}
						}
					} @else {
						<!-- Angular extension: use ngComponentOutlet -->
						@switch (getWrapperType(mounted.extension)) {
							@case ('card') {
								<nb-card>
									@if (getWrapperConfig(mounted.extension)?.showHeader !== false) {
										<nb-card-header>
											{{
												getWrapperConfig(mounted.extension)?.title ||
													mounted.extension.metadata?.title ||
													mounted.extension.id
											}}
										</nb-card-header>
									}
									<nb-card-body>
										@if (mounted.resolvedComponent) {
											<ng-container
												*ngComponentOutlet="
													mounted.resolvedComponent;
													inputs: $any(mounted.extension.config)
												"
											/>
										}
									</nb-card-body>
								</nb-card>
							}
							@case ('widget') {
								<nb-card class="extension-widget">
									<nb-card-body>
										@if (mounted.resolvedComponent) {
											<ng-container
												*ngComponentOutlet="
													mounted.resolvedComponent;
													inputs: $any(mounted.extension.config)
												"
											/>
										}
									</nb-card-body>
								</nb-card>
							}
							@case ('window') {
								<nb-card class="extension-window">
									@if (getWrapperConfig(mounted.extension)?.showHeader !== false) {
										<nb-card-header>
											{{
												getWrapperConfig(mounted.extension)?.title ||
													mounted.extension.metadata?.title ||
													mounted.extension.id
											}}
										</nb-card-header>
									}
									<nb-card-body>
										@if (mounted.resolvedComponent) {
											<ng-container
												*ngComponentOutlet="
													mounted.resolvedComponent;
													inputs: $any(mounted.extension.config)
												"
											/>
										}
									</nb-card-body>
								</nb-card>
							}
							@case ('panel') {
								<div class="extension-panel" [class]="getWrapperConfig(mounted.extension)?.cssClass">
									@if (
										getWrapperConfig(mounted.extension)?.showHeader !== false &&
										getWrapperConfig(mounted.extension)?.title
									) {
										<div class="extension-panel-header">
											{{ getWrapperConfig(mounted.extension)?.title }}
										</div>
									}
									<div class="extension-panel-body">
										@if (mounted.resolvedComponent) {
											<ng-container
												*ngComponentOutlet="
													mounted.resolvedComponent;
													inputs: $any(mounted.extension.config)
												"
											/>
										}
									</div>
								</div>
							}
							@case ('custom') {
								<div
									class="extension-custom-wrapper"
									[class]="getWrapperConfig(mounted.extension)?.cssClass"
								>
									@if (getWrapperConfig(mounted.extension)?.component) {
										<!-- Render custom wrapper component with extension info as inputs -->
										<ng-container
											*ngComponentOutlet="
												getWrapperConfig(mounted.extension)!.component!;
												inputs: getCustomWrapperInputs(mounted)
											"
										/>
									} @else if (mounted.resolvedComponent) {
										<!-- Fallback: no wrapper component, render extension directly -->
										<ng-container
											*ngComponentOutlet="
												mounted.resolvedComponent;
												inputs: $any(mounted.extension.config)
											"
										/>
									}
								</div>
							}
							@default {
								@if (mounted.resolvedComponent) {
									<ng-container
										*ngComponentOutlet="
											mounted.resolvedComponent;
											inputs: $any(mounted.extension.config)
										"
									/>
								}
							}
						}
					}
				</div>
			}
		}
	`, isInline: true, styles: [":host{display:contents}.extension-container{display:contents}.extension-widget{margin-bottom:1rem}.extension-window{margin-bottom:1.5rem}.extension-panel{margin-bottom:1rem}.extension-panel-header{font-weight:600;margin-bottom:.5rem;padding:.5rem;border-bottom:1px solid var(--border-basic-color-3, #edf1f7)}.extension-panel-body{padding:.5rem}.extension-loading{padding:1rem;text-align:center;color:var(--text-hint-color, #8f9bb3);font-size:.875rem}.extension-error{padding:1rem;text-align:center;color:var(--color-danger-500, #ff3d71);font-size:.875rem;display:flex;align-items:center;justify-content:center;gap:.5rem}.extension-error button{padding:.25rem .75rem;border:1px solid var(--color-danger-500, #ff3d71);border-radius:4px;background:transparent;color:var(--color-danger-500, #ff3d71);cursor:pointer;font-size:.75rem}.extension-error button:hover{background:var(--color-danger-500, #ff3d71);color:#fff}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgComponentOutlet, selector: "[ngComponentOutlet]", inputs: ["ngComponentOutlet", "ngComponentOutletInputs", "ngComponentOutletInjector", "ngComponentOutletEnvironmentInjector", "ngComponentOutletContent", "ngComponentOutletNgModule"], exportAs: ["ngComponentOutlet"] }, { kind: "ngmodule", type: NbCardModule }, { kind: "component", type: i2.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i2.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i2.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "component", type: FrameworkHostComponent, selector: "gz-framework-host", inputs: ["frameworkId", "component", "loadComponent", "props", "context"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PageExtensionSlotComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-page-extension-slot', standalone: true, imports: [CommonModule, NbCardModule, FrameworkHostComponent], template: `
		@for (mounted of _mountedExtensions; track mounted.extension.id) {
			@if (mounted.mounted) {
				<div
					class="extension-container"
					[class]="extensionClass"
					[attr.data-extension-id]="mounted.extension.id"
					[attr.data-framework]="mounted.extension.frameworkId"
				>
					@if (mounted.loading) {
						<div class="extension-loading">Loading…</div>
					} @else if (mounted.error) {
						<div class="extension-error">
							<span>Failed to load "{{ mounted.extension.id }}"</span>
							<button (click)="retryExtension(mounted)">Retry</button>
						</div>
					} @else if (mounted.isFramework) {
						<!-- Framework extension: delegate to gz-framework-host -->
						@switch (getWrapperType(mounted.extension)) {
							@case ('card') {
								<nb-card>
									@if (getWrapperConfig(mounted.extension)?.showHeader !== false) {
										<nb-card-header>
											{{
												getWrapperConfig(mounted.extension)?.title ||
													mounted.extension.metadata?.title ||
													mounted.extension.id
											}}
										</nb-card-header>
									}
									<nb-card-body>
										<gz-framework-host
											[frameworkId]="mounted.extension.frameworkId!"
											[component]="mounted.resolvedFrameworkComponent"
											[loadComponent]="mounted.loadFrameworkComponent"
											[props]="$any(mounted.extension.config)?.props"
											[context]="$any(mounted.extension.config)?.context"
										/>
									</nb-card-body>
								</nb-card>
							}
							@case ('widget') {
								<nb-card class="extension-widget">
									<nb-card-body>
										<gz-framework-host
											[frameworkId]="mounted.extension.frameworkId!"
											[component]="mounted.resolvedFrameworkComponent"
											[loadComponent]="mounted.loadFrameworkComponent"
											[props]="$any(mounted.extension.config)?.props"
											[context]="$any(mounted.extension.config)?.context"
										/>
									</nb-card-body>
								</nb-card>
							}
							@case ('window') {
								<nb-card class="extension-window">
									@if (getWrapperConfig(mounted.extension)?.showHeader !== false) {
										<nb-card-header>
											{{
												getWrapperConfig(mounted.extension)?.title ||
													mounted.extension.metadata?.title ||
													mounted.extension.id
											}}
										</nb-card-header>
									}
									<nb-card-body>
										<gz-framework-host
											[frameworkId]="mounted.extension.frameworkId!"
											[component]="mounted.resolvedFrameworkComponent"
											[loadComponent]="mounted.loadFrameworkComponent"
											[props]="$any(mounted.extension.config)?.props"
											[context]="$any(mounted.extension.config)?.context"
										/>
									</nb-card-body>
								</nb-card>
							}
							@case ('panel') {
								<div class="extension-panel" [class]="getWrapperConfig(mounted.extension)?.cssClass">
									@if (
										getWrapperConfig(mounted.extension)?.showHeader !== false &&
										getWrapperConfig(mounted.extension)?.title
									) {
										<div class="extension-panel-header">
											{{ getWrapperConfig(mounted.extension)?.title }}
										</div>
									}
									<div class="extension-panel-body">
										<gz-framework-host
											[frameworkId]="mounted.extension.frameworkId!"
											[component]="mounted.resolvedFrameworkComponent"
											[loadComponent]="mounted.loadFrameworkComponent"
											[props]="$any(mounted.extension.config)?.props"
											[context]="$any(mounted.extension.config)?.context"
										/>
									</div>
								</div>
							}
							@default {
								<gz-framework-host
									[frameworkId]="mounted.extension.frameworkId!"
									[component]="mounted.resolvedFrameworkComponent"
									[loadComponent]="mounted.loadFrameworkComponent"
									[props]="$any(mounted.extension.config)?.props"
									[context]="$any(mounted.extension.config)?.context"
								/>
							}
						}
					} @else {
						<!-- Angular extension: use ngComponentOutlet -->
						@switch (getWrapperType(mounted.extension)) {
							@case ('card') {
								<nb-card>
									@if (getWrapperConfig(mounted.extension)?.showHeader !== false) {
										<nb-card-header>
											{{
												getWrapperConfig(mounted.extension)?.title ||
													mounted.extension.metadata?.title ||
													mounted.extension.id
											}}
										</nb-card-header>
									}
									<nb-card-body>
										@if (mounted.resolvedComponent) {
											<ng-container
												*ngComponentOutlet="
													mounted.resolvedComponent;
													inputs: $any(mounted.extension.config)
												"
											/>
										}
									</nb-card-body>
								</nb-card>
							}
							@case ('widget') {
								<nb-card class="extension-widget">
									<nb-card-body>
										@if (mounted.resolvedComponent) {
											<ng-container
												*ngComponentOutlet="
													mounted.resolvedComponent;
													inputs: $any(mounted.extension.config)
												"
											/>
										}
									</nb-card-body>
								</nb-card>
							}
							@case ('window') {
								<nb-card class="extension-window">
									@if (getWrapperConfig(mounted.extension)?.showHeader !== false) {
										<nb-card-header>
											{{
												getWrapperConfig(mounted.extension)?.title ||
													mounted.extension.metadata?.title ||
													mounted.extension.id
											}}
										</nb-card-header>
									}
									<nb-card-body>
										@if (mounted.resolvedComponent) {
											<ng-container
												*ngComponentOutlet="
													mounted.resolvedComponent;
													inputs: $any(mounted.extension.config)
												"
											/>
										}
									</nb-card-body>
								</nb-card>
							}
							@case ('panel') {
								<div class="extension-panel" [class]="getWrapperConfig(mounted.extension)?.cssClass">
									@if (
										getWrapperConfig(mounted.extension)?.showHeader !== false &&
										getWrapperConfig(mounted.extension)?.title
									) {
										<div class="extension-panel-header">
											{{ getWrapperConfig(mounted.extension)?.title }}
										</div>
									}
									<div class="extension-panel-body">
										@if (mounted.resolvedComponent) {
											<ng-container
												*ngComponentOutlet="
													mounted.resolvedComponent;
													inputs: $any(mounted.extension.config)
												"
											/>
										}
									</div>
								</div>
							}
							@case ('custom') {
								<div
									class="extension-custom-wrapper"
									[class]="getWrapperConfig(mounted.extension)?.cssClass"
								>
									@if (getWrapperConfig(mounted.extension)?.component) {
										<!-- Render custom wrapper component with extension info as inputs -->
										<ng-container
											*ngComponentOutlet="
												getWrapperConfig(mounted.extension)!.component!;
												inputs: getCustomWrapperInputs(mounted)
											"
										/>
									} @else if (mounted.resolvedComponent) {
										<!-- Fallback: no wrapper component, render extension directly -->
										<ng-container
											*ngComponentOutlet="
												mounted.resolvedComponent;
												inputs: $any(mounted.extension.config)
											"
										/>
									}
								</div>
							}
							@default {
								@if (mounted.resolvedComponent) {
									<ng-container
										*ngComponentOutlet="
											mounted.resolvedComponent;
											inputs: $any(mounted.extension.config)
										"
									/>
								}
							}
						}
					}
				</div>
			}
		}
	`, changeDetection: ChangeDetectionStrategy.OnPush, styles: [":host{display:contents}.extension-container{display:contents}.extension-widget{margin-bottom:1rem}.extension-window{margin-bottom:1.5rem}.extension-panel{margin-bottom:1rem}.extension-panel-header{font-weight:600;margin-bottom:.5rem;padding:.5rem;border-bottom:1px solid var(--border-basic-color-3, #edf1f7)}.extension-panel-body{padding:.5rem}.extension-loading{padding:1rem;text-align:center;color:var(--text-hint-color, #8f9bb3);font-size:.875rem}.extension-error{padding:1rem;text-align:center;color:var(--color-danger-500, #ff3d71);font-size:.875rem;display:flex;align-items:center;justify-content:center;gap:.5rem}.extension-error button{padding:.25rem .75rem;border:1px solid var(--color-danger-500, #ff3d71);border-radius:4px;background:transparent;color:var(--color-danger-500, #ff3d71);cursor:pointer;font-size:.75rem}.extension-error button:hover{background:var(--color-danger-500, #ff3d71);color:#fff}\n"] }]
        }], propDecorators: { slotId: [{
                type: Input,
                args: [{ required: true }]
            }], extensionClass: [{
                type: Input
            }], defaultWrapper: [{
                type: Input
            }], visibilityContext: [{
                type: Input
            }], contextData: [{
                type: Input
            }], reactive: [{
                type: Input
            }] } });
//# sourceMappingURL=page-extension-slot.component.js.map