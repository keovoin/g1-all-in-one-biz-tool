import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentFactoryResolver, Input, ViewChild, ViewContainerRef } from '@angular/core';
import * as i0 from "@angular/core";
export class ThemeSidebarComponent {
    constructor(componentFactoryResolver, changeDetectorRef) {
        this.componentFactoryResolver = componentFactoryResolver;
        this.changeDetectorRef = changeDetectorRef;
    }
    ngAfterViewInit() {
        this.loadComponent();
        this.changeDetectorRef.detectChanges();
    }
    async loadComponent() {
        const renderComponent = this.config.loadComponent();
        const component = renderComponent instanceof Promise ? await renderComponent : renderComponent;
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
        this.componentRef = this.container.createComponent(componentFactory);
        this.componentRef.changeDetectorRef.markForCheck();
    }
    ngOnDestroy() {
        if (this.componentRef) {
            this.componentRef.destroy();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ThemeSidebarComponent, deps: [{ token: i0.ComponentFactoryResolver }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: ThemeSidebarComponent, isStandalone: false, selector: "ngx-theme-sidebar", inputs: { config: "config" }, viewQueries: [{ propertyName: "container", first: true, predicate: ["container"], descendants: true, read: ViewContainerRef }], ngImport: i0, template: "<ng-template #container></ng-template>\n", styles: [":host{width:100%}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ThemeSidebarComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-theme-sidebar', changeDetection: ChangeDetectionStrategy.OnPush, standalone: false, template: "<ng-template #container></ng-template>\n", styles: [":host{width:100%}\n"] }]
        }], ctorParameters: () => [{ type: i0.ComponentFactoryResolver }, { type: i0.ChangeDetectorRef }], propDecorators: { config: [{
                type: Input
            }], container: [{
                type: ViewChild,
                args: ['container', { read: ViewContainerRef }]
            }] } });
//# sourceMappingURL=theme-sidebar.component.js.map