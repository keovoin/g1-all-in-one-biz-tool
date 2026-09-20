import { AfterViewInit, ChangeDetectorRef, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { LatLng } from 'leaflet';
import { BonusTypeEnum, ICountry, ITag, ICurrency, IUser, IImageAsset } from '@gauzy/contracts';
import { Store, ToastrService } from '@gauzy/ui-core/core';
import { FormHelpers, LeafletMapComponent, LocationFormComponent } from '../../forms';
import * as i0 from "@angular/core";
export declare class OrganizationsStepFormComponent implements OnInit, OnDestroy, AfterViewInit {
    private readonly fb;
    private readonly toastrService;
    private readonly cdr;
    private readonly store;
    private readonly _activatedRoute;
    private readonly location;
    FormHelpers: typeof FormHelpers;
    locationFormBlank: boolean;
    hoverState: boolean;
    countries: ICountry[];
    defaultValueDateTypes: string[];
    defaultBonusTypes: string[];
    weekdays: string[];
    regionCodes: string[];
    regionCode: string;
    numberFormats: string[];
    listOfDateFormats: string[];
    user: IUser;
    retrieveEmail: string;
    createOrganization: EventEmitter<any>;
    closeForm: EventEmitter<any>;
    locationFormDirective: LocationFormComponent;
    leafletTemplate: LeafletMapComponent;
    _isOnboarding: boolean;
    get isOnboarding(): boolean;
    set isOnboarding(value: boolean);
    _closable: boolean;
    get closable(): boolean;
    set closable(value: boolean);
    loading: boolean;
    readonly orgMainForm: UntypedFormGroup;
    static buildOrgMainForm(fb: UntypedFormBuilder): UntypedFormGroup;
    /**
     * Location Mutation Form
     */
    readonly locationForm: UntypedFormGroup;
    readonly orgBonusForm: UntypedFormGroup;
    static buildOrgBonusForm(fb: UntypedFormBuilder): UntypedFormGroup;
    readonly orgSettingsForm: UntypedFormGroup;
    static buildOrgSettingsForm(fb: UntypedFormBuilder): UntypedFormGroup;
    readonly employeeFeatureForm: UntypedFormGroup;
    static buildEmployeeFeatureForm(fb: UntypedFormBuilder): UntypedFormGroup;
    constructor(fb: UntypedFormBuilder, toastrService: ToastrService, cdr: ChangeDetectorRef, store: Store, _activatedRoute: ActivatedRoute, location: Location);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    private _setFormValues;
    /**
     * Upload organization image/avatar
     *
     * @param image
     */
    updateImageAsset(image: IImageAsset): void;
    handleImageUploadError(error: any): void;
    loadDefaultBonusPercentage(bonusType: BonusTypeEnum): void;
    toggleExpiry(checked: boolean): void;
    numberFormatPreview(format: string): string;
    dateFormatPreview(format: string): string;
    addOrganization(): void;
    submitEmployeeFeature(): void;
    selectedTagsEvent(tags: ITag[]): void;
    currencyChanged($event: ICurrency): void;
    onCoordinatesChanges($event: google.maps.LatLng | google.maps.LatLngLiteral): void;
    onMapClicked(latlng: LatLng): void;
    /**
     * GET location old state & patch form value
     * We are using such functionality for create new organization from header selector
     *
     * @param state
     */
    patchUsingLocationState(state: {
        [key: string]: any;
    }): void;
    onGeometrySend(geometry: any): void;
    close(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<OrganizationsStepFormComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<OrganizationsStepFormComponent, "ga-organizations-step-form", never, { "isOnboarding": { "alias": "isOnboarding"; "required": false; }; "closable": { "alias": "closable"; "required": false; }; "loading": { "alias": "loading"; "required": false; }; }, { "createOrganization": "createOrganization"; "closeForm": "closeForm"; }, never, never, false, never>;
}
