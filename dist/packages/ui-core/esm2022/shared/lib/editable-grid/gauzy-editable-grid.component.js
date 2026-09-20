import { __decorate, __metadata } from "tslib";
import { Component, Input, TemplateRef, EventEmitter, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NbDialogService } from '@nebular/theme';
import { take, tap, filter } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "@nebular/theme";
import * as i3 from "../gauzy-button-action/gauzy-button-action.component";
let GauzyEditableGridComponent = class GauzyEditableGridComponent extends TranslationBaseComponent {
    constructor(translateService, dialogService) {
        super(translateService);
        this.translateService = translateService;
        this.dialogService = dialogService;
        this.dialogData = new EventEmitter();
        this.currentAction = null;
    }
    ngOnInit() { }
    toggleItemSelection(item) {
        if (!this.selectedItem || this.selectedItem.id !== item.id) {
            this.selectedItem = item;
            return;
        }
        this.selectedItem = null;
    }
    openDialog(itemAction, template) {
        this.currentAction = itemAction;
        this.dialogService
            .open(
        // Type assertion needed due to multiple @angular/core versions in monorepo causing TemplateRef type mismatch
        template)
            .onClose.pipe(tap(() => {
            this.selectedItem = null;
        }), filter(Boolean), tap((data) => {
            // this.currentAction = itemAction;
            this.dialogData.emit({
                actionType: itemAction,
                data
            });
        }), take(1), untilDestroyed(this))
            .subscribe();
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GauzyEditableGridComponent, deps: [{ token: i1.TranslateService }, { token: i2.NbDialogService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: GauzyEditableGridComponent, isStandalone: false, selector: "ga-editable-grid", inputs: { items: "items", itemTmpl: "itemTmpl", addDialogTmpl: "addDialogTmpl", editDialogTmpl: "editDialogTmpl", deleteDialogTmpl: "deleteDialogTmpl" }, outputs: { dialogData: "dialogData" }, usesInheritance: true, ngImport: i0, template: "<ng-template #dialog let-data let-action=\"currentAction\" let-ref=\"dialogRef\">\n\t@if (currentAction === 'create') {\n\t\t<ng-template\n\t\t\t[ngTemplateOutlet]=\"addDialogTmpl\"\n\t\t\t[ngTemplateOutletContext]=\"{\n\t\t\t\t$implicit: selectedItem,\n\t\t\t\taction: currentAction,\n\t\t\t\tdialogRef: ref\n\t\t\t}\"\n\t\t>\n\t\t</ng-template>\n\t}\n\n\t@if (currentAction === 'edit') {\n\t\t<ng-template\n\t\t\t[ngTemplateOutlet]=\"editDialogTmpl\"\n\t\t\t[ngTemplateOutletContext]=\"{\n\t\t\t\t$implicit: selectedItem,\n\t\t\t\taction: currentAction,\n\t\t\t\tdialogRef: ref\n\t\t\t}\"\n\t\t>\n\t\t</ng-template>\n\t}\n\n\t@if (currentAction === 'delete') {\n\t\t<ng-template\n\t\t\t[ngTemplateOutlet]=\"deleteDialogTmpl\"\n\t\t\t[ngTemplateOutletContext]=\"{\n\t\t\t\t$implicit: selectedItem,\n\t\t\t\taction: currentAction,\n\t\t\t\tdialogRef: ref\n\t\t\t}\"\n\t\t>\n\t\t</ng-template>\n\t}\n</ng-template>\n\n<ng-container>\n\t<nb-card size=\"medium\">\n\t\t<nb-card-header class=\"pb-0 pr-0 pl-0\">\n\t\t\t<div class=\"d-flex align-items-center justify-content-between\">\n\t\t\t\t<span>{{ 'TASKS_PAGE.SPRINTS_SETTINGS' | translate }}</span>\n\t\t\t\t<ngx-gauzy-button-action\n\t\t\t\t\t[hasLayoutSelector]=\"false\"\n\t\t\t\t\t[buttonTemplate]=\"actionButtons\"\n\t\t\t\t\t[buttonTemplateVisible]=\"visible\"\n\t\t\t\t\t[isDisable]=\"!selectedItem\"\n\t\t\t\t></ngx-gauzy-button-action>\n\t\t\t</div>\n\t\t</nb-card-header>\n\t\t<nb-list>\n\t\t\t@for (item of items; track item) {\n\t\t\t\t<nb-list-item [class.selected-item]=\"selectedItem?.id === item?.id\" (click)=\"toggleItemSelection(item)\">\n\t\t\t\t\t<ng-container\n\t\t\t\t\t\t[ngTemplateOutlet]=\"itemTmpl\"\n\t\t\t\t\t\t[ngTemplateOutletContext]=\"{ $implicit: item }\"\n\t\t\t\t\t></ng-container>\n\t\t\t\t</nb-list-item>\n\t\t\t}\n\t\t</nb-list>\n\t</nb-card>\n</ng-container>\n\n<ng-template #actionButtons>\n\t<div class=\"actions\">\n\t\t<button\n\t\t\tnbButton\n\t\t\tstatus=\"basic\"\n\t\t\t[disabled]=\"!selectedItem\"\n\t\t\t(click)=\"openDialog('edit', dialog)\"\n\t\t\tclass=\"action primary\"\n\t\t\tsize=\"small\"\n\t\t>\n\t\t\t<nb-icon class=\"mr-1\" icon=\"edit-outline\"></nb-icon>\n\t\t\t{{ 'BUTTONS.EDIT' | translate }}\n\t\t</button>\n\t\t<button\n\t\t\tnbButton\n\t\t\tstatus=\"basic\"\n\t\t\t[disabled]=\"!selectedItem\"\n\t\t\t(click)=\"openDialog('delete', dialog)\"\n\t\t\tclass=\"action\"\n\t\t\tsize=\"small\"\n\t\t>\n\t\t\t<nb-icon status=\"danger\" icon=\"trash-2-outline\"></nb-icon>\n\t\t\t<!-- {{ 'BUTTONS.DELETE' | translate }} -->\n\t\t</button>\n\t</div>\n</ng-template>\n<ng-template #visible>\n\t<button nbButton status=\"info\" (click)=\"openDialog('create', dialog)\" class=\"action\" size=\"small\">\n\t\t<nb-icon icon=\"plus-outline\"></nb-icon>\n\t\t{{ 'BUTTONS.CREATE' | translate }}\n\t</button>\n</ng-template>\n", styles: [".action{box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));border:none}.action[nbButton].appearance-filled.status-basic{background-color:var(--gauzy-card-2)}.action.info[nbButton].appearance-filled.status-basic,.action.info-text-1[nbButton].appearance-filled.status-basic{color:var(--gauzy-action-info-text)}.action.secondary{color:var(--text-hint-color)}.action.success{color:var(--gauzy-action-success-text)}.action.warning{color:var(--gauzy-action-warning-text)}.action.orange{color:#ffab2d}.action.primary{color:var(--text-primary-color)}.action.primary.soft[nbButton].appearance-filled.status-basic{background-color:#6e49e81a}.action.select-nb ::ng-deep{box-shadow:none}.action.select-nb ::ng-deep .select-button{box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));background:var(--gauzy-card-2)}button{margin:5px}.actions{background:var(--gauzy-card-2);border-radius:var(--button-rectangle-border-radius);padding:2px 4px!important}.gauzy-button-container{display:flex;justify-content:flex-end;width:100%;padding-bottom:0}.card-custom-header{display:flex;flex-direction:column;width:100%;padding-bottom:0}:host ::ng-deep input{border-radius:var(--border-radius);box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18))}.selected-item{background:#7e7e8f1a;box-shadow:12.5px 0 0 -5px #7e7e8f1a inset;border-radius:var(--border-radius)}:host nb-list-item{background-color:var(--gauzy-card-4);margin-top:4px;border-radius:var(--border-radius)}:host nb-card{background-color:unset}:host nb-card.size-medium{height:calc(100vh - 30rem)}:host ngx-gauzy-button-action ::ng-deep .actions-container{padding-top:0}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "component", type: i2.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i2.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "component", type: i2.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i2.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "component", type: i2.NbListComponent, selector: "nb-list", inputs: ["role"] }, { kind: "component", type: i2.NbListItemComponent, selector: "nb-list-item", inputs: ["role"] }, { kind: "component", type: i3.GauzyButtonActionComponent, selector: "ngx-gauzy-button-action", inputs: ["isDisable", "hasLayoutSelector", "componentName", "buttonTemplate", "buttonTemplateVisible"] }, { kind: "pipe", type: i1.TranslatePipe, name: "translate" }] }); }
};
GauzyEditableGridComponent = __decorate([
    UntilDestroy(),
    __metadata("design:paramtypes", [TranslateService,
        NbDialogService])
], GauzyEditableGridComponent);
export { GauzyEditableGridComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GauzyEditableGridComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-editable-grid', standalone: false, template: "<ng-template #dialog let-data let-action=\"currentAction\" let-ref=\"dialogRef\">\n\t@if (currentAction === 'create') {\n\t\t<ng-template\n\t\t\t[ngTemplateOutlet]=\"addDialogTmpl\"\n\t\t\t[ngTemplateOutletContext]=\"{\n\t\t\t\t$implicit: selectedItem,\n\t\t\t\taction: currentAction,\n\t\t\t\tdialogRef: ref\n\t\t\t}\"\n\t\t>\n\t\t</ng-template>\n\t}\n\n\t@if (currentAction === 'edit') {\n\t\t<ng-template\n\t\t\t[ngTemplateOutlet]=\"editDialogTmpl\"\n\t\t\t[ngTemplateOutletContext]=\"{\n\t\t\t\t$implicit: selectedItem,\n\t\t\t\taction: currentAction,\n\t\t\t\tdialogRef: ref\n\t\t\t}\"\n\t\t>\n\t\t</ng-template>\n\t}\n\n\t@if (currentAction === 'delete') {\n\t\t<ng-template\n\t\t\t[ngTemplateOutlet]=\"deleteDialogTmpl\"\n\t\t\t[ngTemplateOutletContext]=\"{\n\t\t\t\t$implicit: selectedItem,\n\t\t\t\taction: currentAction,\n\t\t\t\tdialogRef: ref\n\t\t\t}\"\n\t\t>\n\t\t</ng-template>\n\t}\n</ng-template>\n\n<ng-container>\n\t<nb-card size=\"medium\">\n\t\t<nb-card-header class=\"pb-0 pr-0 pl-0\">\n\t\t\t<div class=\"d-flex align-items-center justify-content-between\">\n\t\t\t\t<span>{{ 'TASKS_PAGE.SPRINTS_SETTINGS' | translate }}</span>\n\t\t\t\t<ngx-gauzy-button-action\n\t\t\t\t\t[hasLayoutSelector]=\"false\"\n\t\t\t\t\t[buttonTemplate]=\"actionButtons\"\n\t\t\t\t\t[buttonTemplateVisible]=\"visible\"\n\t\t\t\t\t[isDisable]=\"!selectedItem\"\n\t\t\t\t></ngx-gauzy-button-action>\n\t\t\t</div>\n\t\t</nb-card-header>\n\t\t<nb-list>\n\t\t\t@for (item of items; track item) {\n\t\t\t\t<nb-list-item [class.selected-item]=\"selectedItem?.id === item?.id\" (click)=\"toggleItemSelection(item)\">\n\t\t\t\t\t<ng-container\n\t\t\t\t\t\t[ngTemplateOutlet]=\"itemTmpl\"\n\t\t\t\t\t\t[ngTemplateOutletContext]=\"{ $implicit: item }\"\n\t\t\t\t\t></ng-container>\n\t\t\t\t</nb-list-item>\n\t\t\t}\n\t\t</nb-list>\n\t</nb-card>\n</ng-container>\n\n<ng-template #actionButtons>\n\t<div class=\"actions\">\n\t\t<button\n\t\t\tnbButton\n\t\t\tstatus=\"basic\"\n\t\t\t[disabled]=\"!selectedItem\"\n\t\t\t(click)=\"openDialog('edit', dialog)\"\n\t\t\tclass=\"action primary\"\n\t\t\tsize=\"small\"\n\t\t>\n\t\t\t<nb-icon class=\"mr-1\" icon=\"edit-outline\"></nb-icon>\n\t\t\t{{ 'BUTTONS.EDIT' | translate }}\n\t\t</button>\n\t\t<button\n\t\t\tnbButton\n\t\t\tstatus=\"basic\"\n\t\t\t[disabled]=\"!selectedItem\"\n\t\t\t(click)=\"openDialog('delete', dialog)\"\n\t\t\tclass=\"action\"\n\t\t\tsize=\"small\"\n\t\t>\n\t\t\t<nb-icon status=\"danger\" icon=\"trash-2-outline\"></nb-icon>\n\t\t\t<!-- {{ 'BUTTONS.DELETE' | translate }} -->\n\t\t</button>\n\t</div>\n</ng-template>\n<ng-template #visible>\n\t<button nbButton status=\"info\" (click)=\"openDialog('create', dialog)\" class=\"action\" size=\"small\">\n\t\t<nb-icon icon=\"plus-outline\"></nb-icon>\n\t\t{{ 'BUTTONS.CREATE' | translate }}\n\t</button>\n</ng-template>\n", styles: [".action{box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));border:none}.action[nbButton].appearance-filled.status-basic{background-color:var(--gauzy-card-2)}.action.info[nbButton].appearance-filled.status-basic,.action.info-text-1[nbButton].appearance-filled.status-basic{color:var(--gauzy-action-info-text)}.action.secondary{color:var(--text-hint-color)}.action.success{color:var(--gauzy-action-success-text)}.action.warning{color:var(--gauzy-action-warning-text)}.action.orange{color:#ffab2d}.action.primary{color:var(--text-primary-color)}.action.primary.soft[nbButton].appearance-filled.status-basic{background-color:#6e49e81a}.action.select-nb ::ng-deep{box-shadow:none}.action.select-nb ::ng-deep .select-button{box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));background:var(--gauzy-card-2)}button{margin:5px}.actions{background:var(--gauzy-card-2);border-radius:var(--button-rectangle-border-radius);padding:2px 4px!important}.gauzy-button-container{display:flex;justify-content:flex-end;width:100%;padding-bottom:0}.card-custom-header{display:flex;flex-direction:column;width:100%;padding-bottom:0}:host ::ng-deep input{border-radius:var(--border-radius);box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18))}.selected-item{background:#7e7e8f1a;box-shadow:12.5px 0 0 -5px #7e7e8f1a inset;border-radius:var(--border-radius)}:host nb-list-item{background-color:var(--gauzy-card-4);margin-top:4px;border-radius:var(--border-radius)}:host nb-card{background-color:unset}:host nb-card.size-medium{height:calc(100vh - 30rem)}:host ngx-gauzy-button-action ::ng-deep .actions-container{padding-top:0}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i2.NbDialogService }], propDecorators: { items: [{
                type: Input
            }], itemTmpl: [{
                type: Input
            }], addDialogTmpl: [{
                type: Input
            }], editDialogTmpl: [{
                type: Input
            }], deleteDialogTmpl: [{
                type: Input
            }], dialogData: [{
                type: Output
            }] } });
//# sourceMappingURL=gauzy-editable-grid.component.js.map