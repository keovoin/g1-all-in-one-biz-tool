import { EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { IBaseEntityWithMembers, ComponentLayoutStyleEnum } from '@gauzy/contracts';
import { IPersonListItem } from '../table-components/people-list/people-list.component';
import * as i0 from "@angular/core";
export declare class EntityWithMembersCardComponent {
    private readonly router;
    entityWithMembers: IBaseEntityWithMembers;
    public: IBaseEntityWithMembers;
    visibleViewButton: boolean;
    remove: EventEmitter<any>;
    edit: EventEmitter<any>;
    view: EventEmitter<any>;
    layout?: ComponentLayoutStyleEnum | undefined;
    constructor(router: Router);
    /**
     * Opens the profile of a member clicked in the people list.
     *
     * @param person The member that was clicked.
     */
    openMember(person: IPersonListItem): void;
    removeEntity(id: string): void;
    editEntity(id: string): void;
    navigateContact(item: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<EntityWithMembersCardComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<EntityWithMembersCardComponent, "ga-entity-with-members-card", never, { "entityWithMembers": { "alias": "entityWithMembers"; "required": false; }; "public": { "alias": "public"; "required": false; }; "visibleViewButton": { "alias": "visibleViewButton"; "required": false; }; "layout": { "alias": "layout"; "required": false; }; }, { "remove": "remove"; "edit": "edit"; "view": "view"; }, never, ["*"], false, never>;
}
