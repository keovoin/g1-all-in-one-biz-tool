import { EventEmitter, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { IOrganization, ITimeOffPolicy } from '@gauzy/contracts';
import { Store } from '@gauzy/ui-core/core';
import { TimeOffService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
export declare class TimeOffPolicySelectComponent implements OnInit {
    private readonly _store;
    private readonly timeOffService;
    policies: ITimeOffPolicy[];
    organization: IOrganization;
    policies$: Subject<any>;
    onChange: any;
    onTouched: any;
    selectedChange: EventEmitter<any>;
    private _policyId;
    set policyId(value: string);
    get policyId(): string;
    private _policy;
    set policy(value: ITimeOffPolicy);
    get policy(): ITimeOffPolicy;
    private _ctrl;
    get ctrl(): FormControl;
    set ctrl(value: FormControl);
    private _placeholder;
    get placeholder(): string;
    set placeholder(value: string);
    private _id;
    get id(): string;
    set id(value: string);
    constructor(_store: Store, timeOffService: TimeOffService);
    ngOnInit(): void;
    writeValue(policyId: ITimeOffPolicy['id']): void;
    registerOnChange(fn: (rating: number) => void): void;
    registerOnTouched(fn: () => void): void;
    /**
     * On policy select
     *
     * @param selectedItem
     */
    onSelectedChange(policyId: string): void;
    /**
     * GET time off policies
     *
     * @returns
     */
    getTimeOffPolicies(): void;
    getPolicyById(policyId: ITimeOffPolicy['id']): ITimeOffPolicy;
    static ɵfac: i0.ɵɵFactoryDeclaration<TimeOffPolicySelectComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TimeOffPolicySelectComponent, "ga-time-off-policy-select", never, { "policyId": { "alias": "policyId"; "required": false; }; "policy": { "alias": "policy"; "required": false; }; "ctrl": { "alias": "ctrl"; "required": false; }; "placeholder": { "alias": "placeholder"; "required": false; }; "id": { "alias": "id"; "required": false; }; }, { "selectedChange": "selectedChange"; }, never, never, false, never>;
}
