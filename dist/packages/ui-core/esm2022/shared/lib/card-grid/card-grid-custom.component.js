import { Component, ComponentFactoryResolver, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { ComponentLayoutStyleEnum } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export class CustomViewComponent {
    constructor(resolver) {
        this.resolver = resolver;
    }
    ngOnInit() {
        this.createCustomComponent();
        this.patchInstance();
    }
    ngOnDestroy() {
        if (this.customComponent) {
            this.customComponent.destroy();
        }
    }
    createCustomComponent() {
        const componentFactory = this.resolver.resolveComponentFactory(this.renderComponent);
        this.customComponent = this.dynamicTarget.createComponent(componentFactory);
    }
    patchInstance() {
        Object.assign(this.customComponent.instance, {
            value: this.value,
            rowData: this.rowData,
            layout: ComponentLayoutStyleEnum.CARDS_GRID
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CustomViewComponent, deps: [{ token: i0.ComponentFactoryResolver }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: CustomViewComponent, isStandalone: false, selector: "ga-custom-component", inputs: { renderComponent: "renderComponent", value: "value", rowData: "rowData" }, viewQueries: [{ propertyName: "dynamicTarget", first: true, predicate: ["dynamicTarget"], descendants: true, read: ViewContainerRef, static: true }], ngImport: i0, template: ` <ng-template #dynamicTarget></ng-template> `, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CustomViewComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ga-custom-component',
                    template: ` <ng-template #dynamicTarget></ng-template> `,
                    standalone: false
                }]
        }], ctorParameters: () => [{ type: i0.ComponentFactoryResolver }], propDecorators: { renderComponent: [{
                type: Input
            }], value: [{
                type: Input
            }], rowData: [{
                type: Input
            }], dynamicTarget: [{
                type: ViewChild,
                args: ['dynamicTarget', { read: ViewContainerRef, static: true }]
            }] } });
//# sourceMappingURL=card-grid-custom.component.js.map