import { __decorate, __metadata } from "tslib";
import { HelpCenterActionEnum, HelpCenterFlagEnum } from '@gauzy/contracts';
import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { TreeComponent } from '@ali-hm/angular-tree-component';
import { firstValueFrom } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { ErrorHandlingService, HelpCenterService, Store, ToastrService } from '@gauzy/ui-core/core';
import { TranslateService } from '@ngx-translate/core';
import { NbDialogService, NbMenuService } from '@nebular/theme';
import { AddIconComponent } from './add-icon/add-icon.component';
import { filter, tap } from 'rxjs/operators';
import { DeleteCategoryComponent } from './delete-category/delete-category.component';
import { DeleteBaseComponent } from './delete-base/delete-base.component';
import { KnowledgeBaseComponent } from './knowledge-base/knowledge-base.component';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@gauzy/ui-core/core";
import * as i3 from "@ngx-translate/core";
import * as i4 from "@ali-hm/angular-tree-component";
let SidebarComponent = class SidebarComponent extends TranslationBaseComponent {
    constructor(dialogService, toastrService, helpService, translateService, errorHandler, nbMenuService, store) {
        super(translateService);
        this.dialogService = dialogService;
        this.toastrService = toastrService;
        this.helpService = helpService;
        this.translateService = translateService;
        this.errorHandler = errorHandler;
        this.nbMenuService = nbMenuService;
        this.store = store;
        this.actionEnum = HelpCenterActionEnum;
        this.tempNodes = [];
        this.nodeId = '';
        this.isChosenNode = false;
        this.nodes = [];
        /**
         *
         */
        this.options = {
            getChildren: (node) => this.helpService.findByBaseId(node.id),
            allowDrag: true,
            allowDrop: (el, { parent }) => parent.data.flag !== HelpCenterFlagEnum.CATEGORY,
            childrenField: 'children'
        };
        /**
         *
         */
        this.clickedNode = new EventEmitter();
        this.deletedNode = new EventEmitter();
    }
    ngOnInit() {
        this.settingsContextMenu = [
            {
                title: this.getTranslation('HELP_PAGE.ADD_CATEGORY')
            },
            {
                title: this.getTranslation('HELP_PAGE.EDIT_BASE')
            },
            {
                title: this.getTranslation('HELP_PAGE.DELETE_BASE')
            }
        ];
        this.store.selectedOrganization$
            .pipe(filter((organization) => !!organization), tap((organization) => (this.organization = organization)), tap(() => this.loadMenu()), untilDestroyed(this))
            .subscribe();
    }
    ngAfterViewInit() {
        this.nbMenuService.onItemClick().subscribe((elem) => {
            if (elem.item.title === this.getTranslation('HELP_PAGE.EDIT_BASE')) {
                this.addEditBase(HelpCenterActionEnum.EDIT);
            }
            if (elem.item.title === this.getTranslation('HELP_PAGE.ADD_CATEGORY')) {
                this.addEditCategory(HelpCenterActionEnum.ADD);
            }
            if (elem.item.title === this.getTranslation('HELP_PAGE.DELETE_BASE')) {
                this.deleteBase();
            }
        });
    }
    setClasses(node) {
        const classes = {
            child: node.data.flag === HelpCenterFlagEnum.CATEGORY && node.data.parentId !== null,
            childout: node.data.flag === HelpCenterFlagEnum.CATEGORY && node.data.parentId === null,
            parent: node.data.flag === HelpCenterFlagEnum.BASE && node.data.parentId === null,
            parentin: node.data.flag === HelpCenterFlagEnum.BASE && node.data.parentId !== null
        };
        return classes;
    }
    async addEditBase(editType) {
        const context = {
            base: null,
            editType,
            flag: HelpCenterFlagEnum.BASE,
            parentId: null
        };
        if (editType === HelpCenterActionEnum.EDIT) {
            const { data } = this.tree.treeModel.getNodeById(this.nodeId);
            context['base'] = data;
        }
        this.dialogService
            .open(KnowledgeBaseComponent, {
            context
        })
            .onClose.pipe(untilDestroyed(this))
            .subscribe(async (data) => {
            if (data) {
                if (editType === HelpCenterActionEnum.EDIT) {
                    this.toastrService.success('TOASTR.MESSAGE.EDITED_BASE', {
                        name: context.base.name
                    });
                }
                else {
                    this.toastrService.success('TOASTR.MESSAGE.CREATED_BASE', {
                        name: data.name
                    });
                }
            }
            this.loadMenu();
            this.tree.treeModel.update();
        });
    }
    async addEditCategory(editType, node) {
        const { data } = this.tree.treeModel.getNodeById(this.nodeId);
        const context = {
            base: null,
            parentId: data.id,
            editType,
            flag: HelpCenterFlagEnum.CATEGORY
        };
        if (editType === HelpCenterActionEnum.EDIT) {
            context['base'] = node;
            this.isChosenNode = true;
        }
        this.dialogService
            .open(KnowledgeBaseComponent, {
            context
        })
            .onClose.pipe(untilDestroyed(this))
            .subscribe(async (data) => {
            if (data) {
                if (editType === HelpCenterActionEnum.EDIT) {
                    this.toastrService.success('TOASTR.MESSAGE.EDITED_CATEGORY', {
                        name: context.base.name
                    });
                }
                else {
                    this.toastrService.success('TOASTR.MESSAGE.EDIT_ADD_CATEGORY', {
                        name: data.name
                    });
                }
            }
            this.loadMenu();
            this.tree.treeModel.update();
        });
    }
    async deleteCategory(node) {
        const dialog = this.dialogService.open(DeleteCategoryComponent, {
            context: {
                category: node
            }
        });
        const data = await firstValueFrom(dialog.onClose);
        if (data) {
            this.deletedNode.emit();
            this.toastrService.success('TOASTR.MESSAGE.DELETED_CATEGORY', {
                name: data.name
            });
            this.loadMenu();
            this.tree.treeModel.update();
        }
    }
    async deleteBase() {
        const someNode = this.tree.treeModel.getNodeById(this.nodeId);
        const dialog = this.dialogService.open(DeleteBaseComponent, {
            context: {
                base: someNode
            }
        });
        const data = await firstValueFrom(dialog.onClose);
        if (data) {
            this.toastrService.success('TOASTR.MESSAGE.DELETED_BASE', {
                name: data.data.name
            });
            await this.loadMenu();
            this.tree.treeModel.update();
        }
    }
    async updateIndexes(oldChildren, newChildren) {
        try {
            await this.helpService.updateBulk(oldChildren, newChildren);
        }
        catch (error) {
            this.errorHandler.handleError(error);
        }
    }
    async onMoveNode($event) {
        for (const node of this.tempNodes) {
            if (node.id === $event.node.id) {
                if (!$event.to.parent.virtual) {
                    await this.helpService.update(node.id, {
                        parent: $event.to.parent
                    });
                }
                else {
                    await this.helpService.update(node.id, {
                        parent: null
                    });
                }
            }
        }
        this.updateIndexes($event.from.parent.children, $event.to.parent.children);
        await this.loadMenu();
        this.tree.treeModel.update();
    }
    onNodeClicked(node) {
        this.nodeId = node.id.toString();
        this.clickedNode.emit(node);
        this.isChosenNode = true;
    }
    async addIcon() {
        const dialog = this.dialogService.open(AddIconComponent);
        const chosenIcon = await firstValueFrom(dialog.onClose);
        if (chosenIcon) {
            const someNode = this.tree.treeModel.getNodeById(this.nodeId);
            someNode.data.icon = chosenIcon;
            await this.helpService.update(someNode.data.id, {
                icon: `${someNode.data.icon}`
            });
        }
        this.tree.treeModel.update();
    }
    async changePrivacy(node) {
        this.nodeId = node.id.toString();
        this.isChosenNode = true;
        const someNode = this.tree.treeModel.getNodeById(this.nodeId);
        someNode.data.privacy = someNode.data.privacy === 'eye-outline' ? 'eye-off-outline' : 'eye-outline';
        try {
            await this.helpService.update(someNode.data.id, {
                privacy: `${someNode.data.privacy}`
            });
        }
        catch (error) {
            this.errorHandler.handleError(error);
        }
        this.tree.treeModel.update();
    }
    async loadMenu() {
        const { tenantId } = this.store.user;
        const { id: organizationId } = this.organization;
        const result = await this.helpService.getAll(['parent', 'children', 'organization'], {
            organizationId,
            tenantId
        });
        if (result) {
            this.tempNodes = result.items;
            this.nodes = this.tempNodes.filter((item) => item.parent === null);
            this.sortMenu(this.nodes);
        }
    }
    sortMenu(nodes) {
        for (const node of nodes) {
            if (node.children) {
                this.sortMenu(node.children);
            }
            nodes.sort((a, b) => a.index - b.index);
        }
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SidebarComponent, deps: [{ token: i1.NbDialogService }, { token: i2.ToastrService }, { token: i2.HelpCenterService }, { token: i3.TranslateService }, { token: i2.ErrorHandlingService }, { token: i1.NbMenuService }, { token: i2.Store }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: SidebarComponent, isStandalone: false, selector: "ga-sidebar", outputs: { clickedNode: "clickedNode", deletedNode: "deletedNode" }, viewQueries: [{ propertyName: "tree", first: true, predicate: TreeComponent, descendants: true }], usesInheritance: true, ngImport: i0, template: "<div class=\"sidemenu-wrap\">\n\t<nb-card class=\"sidemenu\">\n\t\t<nb-card-body class=\"sidebar\">\n\t\t\t<div class=\"add-icon-field\">\n\t\t\t\t<button status=\"success\" class=\"base-button\" (click)=\"addEditBase(actionEnum.ADD)\" nbButton>\n\t\t\t\t\t{{ 'HELP_PAGE.KNOWLEDGE_BASE' | translate }}\n\t\t\t\t\t<nb-icon class=\"mr-1\" icon=\"plus-outline\"></nb-icon>\n\t\t\t\t</button>\n\t\t\t</div>\n\t\t\t<div class=\"edit-node-field\">\n\t\t\t\t<tree-root #tree [focused]=\"false\" [nodes]=\"nodes\" [options]=\"options\" (moveNode)=\"onMoveNode($event)\">\n\t\t\t\t\t<ng-template #loadingTemplate>{{ 'LOADING' | translate }}</ng-template>\n\t\t\t\t\t<ng-template #treeNodeTemplate let-node let-index=\"index\" class=\"tree\">\n\t\t\t\t\t\t<div\n\t\t\t\t\t\t\tclass=\"base\"\n\t\t\t\t\t\t\t[class]=\"setClasses(node)\"\n\t\t\t\t\t\t\t[style.color]=\"node.data.color\"\n\t\t\t\t\t\t\t(click)=\"onNodeClicked(node.data)\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<nb-icon icon=\"{{ node.data.icon }}\" class=\"icons\" (click)=\"addIcon(node)\"></nb-icon>\n\t\t\t\t\t\t\t\t<span class=\"text\">{{ node.data.name }}</span>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class=\"d-flex\">\n\t\t\t\t\t\t\t\t<div class=\"d-flex\">\n\t\t\t\t\t\t\t\t\t<nb-icon\n\t\t\t\t\t\t\t\t\t\tclass=\"icons privacy\"\n\t\t\t\t\t\t\t\t\t\ticon=\"{{ node.data.privacy }}\"\n\t\t\t\t\t\t\t\t\t\t(click)=\"changePrivacy(node.data)\"\n\t\t\t\t\t\t\t\t\t\t[class.privacy-base]=\"node.data.flag === 'base'\"\n\t\t\t\t\t\t\t\t\t\t[class.privacy-category]=\"node.data.flag === 'category'\"\n\t\t\t\t\t\t\t\t\t></nb-icon>\n\t\t\t\t\t\t\t\t\t@if (node.data.flag === 'base') {\n\t\t\t\t\t\t\t\t\t<nb-action\n\t\t\t\t\t\t\t\t\t\ticon=\"settings-2-outline\"\n\t\t\t\t\t\t\t\t\t\tclass=\"icons\"\n\t\t\t\t\t\t\t\t\t\t[nbContextMenu]=\"settingsContextMenu\"\n\t\t\t\t\t\t\t\t\t></nb-action>\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t@if (node.data.flag === 'category') {\n\t\t\t\t\t\t\t\t<nb-icon\n\t\t\t\t\t\t\t\t\t[style.color]=\"'var(--text-primary-color)'\"\n\t\t\t\t\t\t\t\t\tclass=\"edit-icons\"\n\t\t\t\t\t\t\t\t\ticon=\"edit-outline\"\n\t\t\t\t\t\t\t\t\t(click)=\"addEditCategory(actionEnum.EDIT, node.data)\"\n\t\t\t\t\t\t\t\t></nb-icon>\n\t\t\t\t\t\t\t\t} @if (node.data.flag === 'category') {\n\t\t\t\t\t\t\t\t<nb-icon\n\t\t\t\t\t\t\t\t\t[style.color]=\"'var(--color-danger-default)'\"\n\t\t\t\t\t\t\t\t\tclass=\"edit-icons\"\n\t\t\t\t\t\t\t\t\ticon=\"trash-2-outline\"\n\t\t\t\t\t\t\t\t\t(click)=\"deleteCategory(node.data)\"\n\t\t\t\t\t\t\t\t></nb-icon>\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</ng-template>\n\t\t\t\t</tree-root>\n\t\t\t</div>\n\t\t</nb-card-body>\n\t</nb-card>\n</div>\n", styles: [".sidemenu-wrap,.sidemenu{display:flex;flex-direction:row;justify-content:space-between;align-items:flex-start}.sidebar{background-color:var(--gauzy-card-2);border-radius:var(--border-radius)}.base-button{margin-bottom:10px;padding:10px 20px;box-shadow:0 1px 1px #00000026;border:unset;font-size:16px;font-weight:700;line-height:16px;letter-spacing:-.009em;text-align:left;width:fit-content}.blue{color:#00f}.text{padding:0 .3rem;font-size:14px;font-weight:600;line-height:17px;letter-spacing:0em;text-align:left}.add-icon-field{flex-direction:column;display:flex}.edit-field{justify-content:space-between;flex-direction:row;display:flex}.add-icon{margin-left:10px;margin-top:2px;color:gray}.base{box-shadow:var(--gauzy-shadow);border-radius:var(--border-radius);padding:10px;display:flex;flex-direction:row;justify-content:space-between;color:var(--gauzy-text-color-1)}.icons{font-family:\"Font Awesome 7 Pro\";font-size:16px;font-weight:400;line-height:14px;letter-spacing:0em;text-align:center}.icons.privacy-category{margin-right:.5rem}[dir=ltr] :host .icons.privacy-base{margin-right:2.25rem}[dir=rtl] :host .icons.privacy-base{margin-left:2.25rem}.edit-icons{display:none;font-size:1.1rem;margin-right:8px}.base:hover .edit-icons{display:inline-block}.edit-node-field{width:100%}.child{min-width:264px;margin-left:-26px;background-color:var(--gauzy-card-3)}:host .parent{min-width:272px;background-color:var(--gauzy-card-3)}[dir=ltr] :host .parent{margin-left:-16px}[dir=rtl] :host .parent{margin-right:-16px}.parentin{min-width:233px;margin-left:-10px}.childout{margin-left:3px;min-width:240px;background-color:var(--gauzy-card-1)}:host ::ng-deep .toggle-children-wrapper .toggle-children{position:relative;top:10px}[dir=ltr] :host ::ng-deep .toggle-children-wrapper .toggle-children{left:220px}[dir=rtl] :host ::ng-deep .toggle-children-wrapper .toggle-children{right:220px}:host ::ng-deep .toggle-children-wrapper .toggle-children{border:solid var(--gauzy-text-color-1);border-width:0 2px 2px 0;display:inline-block;width:8px;background-image:none}:host ::ng-deep .node-content-wrapper-focused{background:transparent}:host ::ng-deep .node-content-wrapper-active,:host ::ng-deep .node-content-wrapper.node-content-wrapper-active:hover,:host ::ng-deep .node-content-wrapper-active.node-content-wrapper-focused{background:transparent;box-shadow:none}:host ::ng-deep .node-content-wrapper-active,:host ::ng-deep .node-content-wrapper-focused,:host ::ng-deep .node-content-wrapper:hover{box-shadow:unset}:host ::ng-deep .node-content-wrapper-active .node-content-wrapper-focused .node-content-wrapper:hover{background:transparent!important;box-shadow:inset 0 0 0 transparent!important;border:none}:host ::ng-deep .node-content-wrapper:hover{background:none;box-shadow:none;border:none}:host ::ng-deep .toggle-children-wrapper-collapsed .toggle-children{transform:rotate(225deg)}:host ::ng-deep .toggle-children-wrapper-expanded .toggle-children{transform:rotate(45deg)}:host nb-card-body,:host nb-card{margin:0}:host nb-card-body{padding:1rem}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "component", type: i1.NbActionComponent, selector: "nb-action", inputs: ["link", "href", "title", "icon", "disabled", "badgeDot", "badgeText", "badgeStatus", "badgePosition"] }, { kind: "component", type: i1.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i1.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i1.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "directive", type: i1.NbContextMenuDirective, selector: "[nbContextMenu]", inputs: ["nbContextMenuPlacement", "nbContextMenuAdjustment", "nbContextMenuTag", "nbContextMenu", "nbContextMenuTrigger", "nbContextMenuClass"] }, { kind: "component", type: i1.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "component", type: i4.TreeComponent, selector: "Tree, tree-root", inputs: ["nodes", "options", "focused", "state"], outputs: ["toggleExpanded", "activate", "deactivate", "nodeActivate", "nodeDeactivate", "select", "deselect", "focus", "blur", "updateData", "initialized", "moveNode", "copyNode", "loadNodeChildren", "changeFilter", "event", "stateChange"] }, { kind: "pipe", type: i3.TranslatePipe, name: "translate" }] }); }
};
SidebarComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [NbDialogService,
        ToastrService,
        HelpCenterService,
        TranslateService,
        ErrorHandlingService,
        NbMenuService,
        Store])
], SidebarComponent);
export { SidebarComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SidebarComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-sidebar', standalone: false, template: "<div class=\"sidemenu-wrap\">\n\t<nb-card class=\"sidemenu\">\n\t\t<nb-card-body class=\"sidebar\">\n\t\t\t<div class=\"add-icon-field\">\n\t\t\t\t<button status=\"success\" class=\"base-button\" (click)=\"addEditBase(actionEnum.ADD)\" nbButton>\n\t\t\t\t\t{{ 'HELP_PAGE.KNOWLEDGE_BASE' | translate }}\n\t\t\t\t\t<nb-icon class=\"mr-1\" icon=\"plus-outline\"></nb-icon>\n\t\t\t\t</button>\n\t\t\t</div>\n\t\t\t<div class=\"edit-node-field\">\n\t\t\t\t<tree-root #tree [focused]=\"false\" [nodes]=\"nodes\" [options]=\"options\" (moveNode)=\"onMoveNode($event)\">\n\t\t\t\t\t<ng-template #loadingTemplate>{{ 'LOADING' | translate }}</ng-template>\n\t\t\t\t\t<ng-template #treeNodeTemplate let-node let-index=\"index\" class=\"tree\">\n\t\t\t\t\t\t<div\n\t\t\t\t\t\t\tclass=\"base\"\n\t\t\t\t\t\t\t[class]=\"setClasses(node)\"\n\t\t\t\t\t\t\t[style.color]=\"node.data.color\"\n\t\t\t\t\t\t\t(click)=\"onNodeClicked(node.data)\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<nb-icon icon=\"{{ node.data.icon }}\" class=\"icons\" (click)=\"addIcon(node)\"></nb-icon>\n\t\t\t\t\t\t\t\t<span class=\"text\">{{ node.data.name }}</span>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class=\"d-flex\">\n\t\t\t\t\t\t\t\t<div class=\"d-flex\">\n\t\t\t\t\t\t\t\t\t<nb-icon\n\t\t\t\t\t\t\t\t\t\tclass=\"icons privacy\"\n\t\t\t\t\t\t\t\t\t\ticon=\"{{ node.data.privacy }}\"\n\t\t\t\t\t\t\t\t\t\t(click)=\"changePrivacy(node.data)\"\n\t\t\t\t\t\t\t\t\t\t[class.privacy-base]=\"node.data.flag === 'base'\"\n\t\t\t\t\t\t\t\t\t\t[class.privacy-category]=\"node.data.flag === 'category'\"\n\t\t\t\t\t\t\t\t\t></nb-icon>\n\t\t\t\t\t\t\t\t\t@if (node.data.flag === 'base') {\n\t\t\t\t\t\t\t\t\t<nb-action\n\t\t\t\t\t\t\t\t\t\ticon=\"settings-2-outline\"\n\t\t\t\t\t\t\t\t\t\tclass=\"icons\"\n\t\t\t\t\t\t\t\t\t\t[nbContextMenu]=\"settingsContextMenu\"\n\t\t\t\t\t\t\t\t\t></nb-action>\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t@if (node.data.flag === 'category') {\n\t\t\t\t\t\t\t\t<nb-icon\n\t\t\t\t\t\t\t\t\t[style.color]=\"'var(--text-primary-color)'\"\n\t\t\t\t\t\t\t\t\tclass=\"edit-icons\"\n\t\t\t\t\t\t\t\t\ticon=\"edit-outline\"\n\t\t\t\t\t\t\t\t\t(click)=\"addEditCategory(actionEnum.EDIT, node.data)\"\n\t\t\t\t\t\t\t\t></nb-icon>\n\t\t\t\t\t\t\t\t} @if (node.data.flag === 'category') {\n\t\t\t\t\t\t\t\t<nb-icon\n\t\t\t\t\t\t\t\t\t[style.color]=\"'var(--color-danger-default)'\"\n\t\t\t\t\t\t\t\t\tclass=\"edit-icons\"\n\t\t\t\t\t\t\t\t\ticon=\"trash-2-outline\"\n\t\t\t\t\t\t\t\t\t(click)=\"deleteCategory(node.data)\"\n\t\t\t\t\t\t\t\t></nb-icon>\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</ng-template>\n\t\t\t\t</tree-root>\n\t\t\t</div>\n\t\t</nb-card-body>\n\t</nb-card>\n</div>\n", styles: [".sidemenu-wrap,.sidemenu{display:flex;flex-direction:row;justify-content:space-between;align-items:flex-start}.sidebar{background-color:var(--gauzy-card-2);border-radius:var(--border-radius)}.base-button{margin-bottom:10px;padding:10px 20px;box-shadow:0 1px 1px #00000026;border:unset;font-size:16px;font-weight:700;line-height:16px;letter-spacing:-.009em;text-align:left;width:fit-content}.blue{color:#00f}.text{padding:0 .3rem;font-size:14px;font-weight:600;line-height:17px;letter-spacing:0em;text-align:left}.add-icon-field{flex-direction:column;display:flex}.edit-field{justify-content:space-between;flex-direction:row;display:flex}.add-icon{margin-left:10px;margin-top:2px;color:gray}.base{box-shadow:var(--gauzy-shadow);border-radius:var(--border-radius);padding:10px;display:flex;flex-direction:row;justify-content:space-between;color:var(--gauzy-text-color-1)}.icons{font-family:\"Font Awesome 7 Pro\";font-size:16px;font-weight:400;line-height:14px;letter-spacing:0em;text-align:center}.icons.privacy-category{margin-right:.5rem}[dir=ltr] :host .icons.privacy-base{margin-right:2.25rem}[dir=rtl] :host .icons.privacy-base{margin-left:2.25rem}.edit-icons{display:none;font-size:1.1rem;margin-right:8px}.base:hover .edit-icons{display:inline-block}.edit-node-field{width:100%}.child{min-width:264px;margin-left:-26px;background-color:var(--gauzy-card-3)}:host .parent{min-width:272px;background-color:var(--gauzy-card-3)}[dir=ltr] :host .parent{margin-left:-16px}[dir=rtl] :host .parent{margin-right:-16px}.parentin{min-width:233px;margin-left:-10px}.childout{margin-left:3px;min-width:240px;background-color:var(--gauzy-card-1)}:host ::ng-deep .toggle-children-wrapper .toggle-children{position:relative;top:10px}[dir=ltr] :host ::ng-deep .toggle-children-wrapper .toggle-children{left:220px}[dir=rtl] :host ::ng-deep .toggle-children-wrapper .toggle-children{right:220px}:host ::ng-deep .toggle-children-wrapper .toggle-children{border:solid var(--gauzy-text-color-1);border-width:0 2px 2px 0;display:inline-block;width:8px;background-image:none}:host ::ng-deep .node-content-wrapper-focused{background:transparent}:host ::ng-deep .node-content-wrapper-active,:host ::ng-deep .node-content-wrapper.node-content-wrapper-active:hover,:host ::ng-deep .node-content-wrapper-active.node-content-wrapper-focused{background:transparent;box-shadow:none}:host ::ng-deep .node-content-wrapper-active,:host ::ng-deep .node-content-wrapper-focused,:host ::ng-deep .node-content-wrapper:hover{box-shadow:unset}:host ::ng-deep .node-content-wrapper-active .node-content-wrapper-focused .node-content-wrapper:hover{background:transparent!important;box-shadow:inset 0 0 0 transparent!important;border:none}:host ::ng-deep .node-content-wrapper:hover{background:none;box-shadow:none;border:none}:host ::ng-deep .toggle-children-wrapper-collapsed .toggle-children{transform:rotate(225deg)}:host ::ng-deep .toggle-children-wrapper-expanded .toggle-children{transform:rotate(45deg)}:host nb-card-body,:host nb-card{margin:0}:host nb-card-body{padding:1rem}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.NbDialogService }, { type: i2.ToastrService }, { type: i2.HelpCenterService }, { type: i3.TranslateService }, { type: i2.ErrorHandlingService }, { type: i1.NbMenuService }, { type: i2.Store }], propDecorators: { clickedNode: [{
                type: Output
            }], deletedNode: [{
                type: Output
            }], tree: [{
                type: ViewChild,
                args: [TreeComponent]
            }] } });
//# sourceMappingURL=sidebar.component.js.map