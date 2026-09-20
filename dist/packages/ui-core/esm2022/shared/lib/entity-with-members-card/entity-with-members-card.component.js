import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentLayoutStyleEnum } from '@gauzy/contracts';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "@nebular/theme";
import * as i3 from "../table-components/notes-with-tags/notes-with-tags.component";
import * as i4 from "../table-components/people-list/people-list.component";
import * as i5 from "@ngx-translate/core";
export class EntityWithMembersCardComponent {
    constructor(router) {
        this.router = router;
        this.visibleViewButton = false;
        this.remove = new EventEmitter();
        this.edit = new EventEmitter();
        this.view = new EventEmitter();
    }
    /**
     * Opens the profile of a member clicked in the people list.
     *
     * @param person The member that was clicked.
     */
    openMember(person) {
        const id = person?.id;
        if (id) {
            this.router.navigate([`/pages/employees/edit/${id}/profile`]);
        }
    }
    removeEntity(id) {
        this.remove.emit(id);
    }
    editEntity(id) {
        this.edit.emit(id);
    }
    navigateContact(item) {
        this.view.emit(item);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EntityWithMembersCardComponent, deps: [{ token: i1.Router }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: EntityWithMembersCardComponent, isStandalone: false, selector: "ga-entity-with-members-card", inputs: { entityWithMembers: "entityWithMembers", public: "public", visibleViewButton: "visibleViewButton", layout: "layout" }, outputs: { remove: "remove", edit: "edit", view: "view" }, ngImport: i0, template: "<nb-card style=\"padding: 0 !important\" class=\"card-body\">\n  <nb-card-header style=\"padding: 0.5rem\">\n    <div class=\"header-container\">\n      <ga-notes-with-tags [rowData]=\"entityWithMembers\" [layout]=\"layout\"> </ga-notes-with-tags>\n      <div class=\"members-count\">\n        {{ 'FORM.PLACEHOLDERS.MEMBERS_COUNT' | translate }}\n        {{ entityWithMembers.members ? entityWithMembers.members.length : 0 }}\n      </div>\n      <ng-content></ng-content>\n    </div>\n  </nb-card-header>\n\n  <nb-card-body class=\"team-card\">\n    <!--\n      Same people treatment as the grid columns (`ngx-people-list`), only\n      allowed to wrap and to name more people, because a card has the room.\n    -->\n    <ngx-people-list\n      class=\"members\"\n      [people]=\"entityWithMembers.members\"\n      [maxNames]=\"8\"\n      [maxAvatars]=\"8\"\n      [wrap]=\"true\"\n      (selectPerson)=\"openMember($event)\"\n    ></ngx-people-list>\n\n    <div class=\"button-container\">\n      @if (visibleViewButton) {\n        <button nbButton class=\"mr-2\" status=\"info\" size=\"tiny\" (click)=\"navigateContact(entityWithMembers)\">\n          <nb-icon class=\"mr-1\" icon=\"eye-outline\"></nb-icon>\n          {{ 'BUTTONS.VIEW' | translate }}\n        </button>\n      }\n      <button nbButton class=\"mr-2\" status=\"success\" size=\"tiny\" (click)=\"editEntity(entityWithMembers.id)\">\n        <nb-icon class=\"mr-1\" icon=\"edit-outline\"></nb-icon>{{ 'BUTTONS.EDIT' | translate }}\n      </button>\n      <button size=\"tiny\" class=\"mr-2\" nbButton (click)=\"removeEntity(entityWithMembers.id)\" status=\"danger\">\n        <nb-icon class=\"mr-2\" icon=\"trash-2-outline\"></nb-icon>{{ 'BUTTONS.DELETE' | translate }}\n      </button>\n    </div>\n  </nb-card-body>\n</nb-card>\n", styles: [":host .card-body{margin:10px}:host .card-body .header-container{text-align:center;position:relative}:host .card-body .header-container .members-count{font-size:.7em;color:var(--text-hint-color)}:host .card-body .team-card{display:flex;flex-direction:column;justify-content:space-between}:host .card-body .team-card .members{min-width:0}:host .card-body .team-card .button-container{display:flex;width:160px;justify-content:space-between;margin-top:15px}[dir=ltr] :host .card-body .team-card .button-container{margin-left:9px}[dir=rtl] :host .card-body .team-card .button-container{margin-right:9px}.color{position:static;margin-top:5px}[dir=ltr] .color{margin-right:5px}[dir=rtl] .color{margin-left:5px}.color{display:inline-block}.tags{display:flex;width:200px;flex-wrap:wrap}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "component", type: i2.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i2.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i2.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "component", type: i2.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i2.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "component", type: i3.NotesWithTagsComponent, selector: "ga-notes-with-tags", inputs: ["rowData", "value", "layout"] }, { kind: "component", type: i4.PeopleListComponent, selector: "ngx-people-list", inputs: ["people", "maxNames", "maxAvatars", "wrap"], outputs: ["selectPerson"] }, { kind: "pipe", type: i5.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EntityWithMembersCardComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-entity-with-members-card', standalone: false, template: "<nb-card style=\"padding: 0 !important\" class=\"card-body\">\n  <nb-card-header style=\"padding: 0.5rem\">\n    <div class=\"header-container\">\n      <ga-notes-with-tags [rowData]=\"entityWithMembers\" [layout]=\"layout\"> </ga-notes-with-tags>\n      <div class=\"members-count\">\n        {{ 'FORM.PLACEHOLDERS.MEMBERS_COUNT' | translate }}\n        {{ entityWithMembers.members ? entityWithMembers.members.length : 0 }}\n      </div>\n      <ng-content></ng-content>\n    </div>\n  </nb-card-header>\n\n  <nb-card-body class=\"team-card\">\n    <!--\n      Same people treatment as the grid columns (`ngx-people-list`), only\n      allowed to wrap and to name more people, because a card has the room.\n    -->\n    <ngx-people-list\n      class=\"members\"\n      [people]=\"entityWithMembers.members\"\n      [maxNames]=\"8\"\n      [maxAvatars]=\"8\"\n      [wrap]=\"true\"\n      (selectPerson)=\"openMember($event)\"\n    ></ngx-people-list>\n\n    <div class=\"button-container\">\n      @if (visibleViewButton) {\n        <button nbButton class=\"mr-2\" status=\"info\" size=\"tiny\" (click)=\"navigateContact(entityWithMembers)\">\n          <nb-icon class=\"mr-1\" icon=\"eye-outline\"></nb-icon>\n          {{ 'BUTTONS.VIEW' | translate }}\n        </button>\n      }\n      <button nbButton class=\"mr-2\" status=\"success\" size=\"tiny\" (click)=\"editEntity(entityWithMembers.id)\">\n        <nb-icon class=\"mr-1\" icon=\"edit-outline\"></nb-icon>{{ 'BUTTONS.EDIT' | translate }}\n      </button>\n      <button size=\"tiny\" class=\"mr-2\" nbButton (click)=\"removeEntity(entityWithMembers.id)\" status=\"danger\">\n        <nb-icon class=\"mr-2\" icon=\"trash-2-outline\"></nb-icon>{{ 'BUTTONS.DELETE' | translate }}\n      </button>\n    </div>\n  </nb-card-body>\n</nb-card>\n", styles: [":host .card-body{margin:10px}:host .card-body .header-container{text-align:center;position:relative}:host .card-body .header-container .members-count{font-size:.7em;color:var(--text-hint-color)}:host .card-body .team-card{display:flex;flex-direction:column;justify-content:space-between}:host .card-body .team-card .members{min-width:0}:host .card-body .team-card .button-container{display:flex;width:160px;justify-content:space-between;margin-top:15px}[dir=ltr] :host .card-body .team-card .button-container{margin-left:9px}[dir=rtl] :host .card-body .team-card .button-container{margin-right:9px}.color{position:static;margin-top:5px}[dir=ltr] .color{margin-right:5px}[dir=rtl] .color{margin-left:5px}.color{display:inline-block}.tags{display:flex;width:200px;flex-wrap:wrap}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.Router }], propDecorators: { entityWithMembers: [{
                type: Input
            }], public: [{
                type: Input
            }], visibleViewButton: [{
                type: Input
            }], remove: [{
                type: Output
            }], edit: [{
                type: Output
            }], view: [{
                type: Output
            }], layout: [{
                type: Input
            }] } });
//# sourceMappingURL=entity-with-members-card.component.js.map