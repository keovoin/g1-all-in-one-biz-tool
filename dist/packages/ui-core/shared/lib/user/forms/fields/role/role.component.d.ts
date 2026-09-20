import { OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { NbComponentSize } from '@nebular/theme';
import { IRole, RolesEnum } from '@gauzy/contracts';
import { Store } from '@gauzy/ui-core/core';
import { RoleService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
export declare class RoleFormFieldComponent implements OnInit, OnDestroy {
    private readonly store;
    private readonly rolesService;
    roles: IRole[];
    roles$: Observable<IRole[]>;
    onChange: any;
    onTouched: any;
    /**
     * Getter & Setter for dynamic remove role from options
     */
    private _excludes;
    get excludes(): RolesEnum[];
    set excludes(value: RolesEnum[]);
    private _id;
    get id(): string;
    set id(value: string);
    private _size;
    get size(): NbComponentSize;
    set size(value: NbComponentSize);
    private _placeholder;
    get placeholder(): string;
    set placeholder(value: string);
    private _label;
    get label(): string;
    set label(value: string);
    private _ctrl;
    get ctrl(): FormControl;
    set ctrl(value: FormControl);
    private _role;
    set role(value: IRole);
    get role(): IRole;
    /**
     * Getter & Setter for internal [(NgModel)]
     */
    private _roleId;
    get roleId(): string;
    set roleId(value: string);
    selectedChange: EventEmitter<IRole>;
    constructor(store: Store, rolesService: RoleService);
    ngOnInit(): void;
    /**
     * GET all tenant roles
     * Excludes role if needed
     */
    renderRoles(): Promise<void>;
    /**
     * Write Value
     * @param value
     */
    writeValue(value: IRole): void;
    registerOnChange(fn: (rating: number) => void): void;
    registerOnTouched(fn: () => void): void;
    /**
     * On Selection Change
     * @param role
     */
    onSelectionChange(roleId: IRole['id']): void;
    /**
     * GET role by ID
     *
     * @param value
     * @returns
     */
    getRoleById(value: IRole['id']): IRole;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<RoleFormFieldComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<RoleFormFieldComponent, "ngx-role-form-field", never, { "excludes": { "alias": "excludes"; "required": false; }; "id": { "alias": "id"; "required": false; }; "size": { "alias": "size"; "required": false; }; "placeholder": { "alias": "placeholder"; "required": false; }; "label": { "alias": "label"; "required": false; }; "ctrl": { "alias": "ctrl"; "required": false; }; }, { "selectedChange": "selectedChange"; }, never, never, false, never>;
}
