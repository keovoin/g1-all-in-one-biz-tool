import { EventEmitter, ElementRef, AfterViewInit, Renderer2, ChangeDetectorRef } from '@angular/core';
import { FormArray, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ICountry, IGeoLocationCreateObject } from '@gauzy/contracts';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { CountryService } from '@gauzy/ui-core/core';
import { FormHelpers } from '../helpers';
import * as i0 from "@angular/core";
export declare class LocationFormComponent extends TranslationBaseComponent implements AfterViewInit {
    readonly translateService: TranslateService;
    readonly countryService: CountryService;
    private readonly cdr;
    private readonly _document;
    private readonly renderer;
    FormHelpers: typeof FormHelpers;
    private _lastUsedAddressText;
    private _lat;
    private _lng;
    showCoordinates: boolean;
    country: string;
    countries: ICountry[];
    readonly form: UntypedFormGroup;
    /**
     *
     */
    private _showAutocompleteSearch;
    get showAutocompleteSearch(): boolean;
    set showAutocompleteSearch(val: boolean);
    /**
     *
     */
    private _showCoordinateInput;
    get showCoordinateInput(): boolean;
    set showCoordinateInput(val: boolean);
    mapCoordinatesEmitter: EventEmitter<google.maps.LatLng | google.maps.LatLngLiteral>;
    mapGeometryEmitter: EventEmitter<google.maps.places.PlaceGeometry | google.maps.GeocoderGeometry>;
    searchElement: ElementRef;
    /**
     *
     * @param fb
     * @returns
     */
    static buildForm(fb: UntypedFormBuilder): UntypedFormGroup;
    constructor(translateService: TranslateService, countryService: CountryService, cdr: ChangeDetectorRef, _document: Document, renderer: Renderer2);
    ngAfterViewInit(): void;
    /**
     *
     */
    get countryControl(): import("@angular/forms").AbstractControl<any, any, any>;
    /**
     *
     */
    get cityControl(): import("@angular/forms").AbstractControl<any, any, any>;
    /**
     *
     */
    get addressControl(): import("@angular/forms").AbstractControl<any, any, any>;
    /**
     *
     */
    get address2Control(): import("@angular/forms").AbstractControl<any, any, any>;
    /**
     *
     */
    get postcodeControl(): import("@angular/forms").AbstractControl<any, any, any>;
    /**
     *
     */
    get coordinates(): FormArray;
    /**
     *
     */
    onAddressChanges(): void;
    /**
     *
     */
    onCoordinatesChanged(): void;
    /**
     *
     * @returns
     */
    getValue(): IGeoLocationCreateObject;
    /**
     *
     * @param geoLocation
     */
    setValue<T extends IGeoLocationCreateObject>(geoLocation: T): void;
    /**
     *
     */
    toggleShowCoordinates(): void;
    /**
     *
     */
    setDefaultCoords(): void;
    /**
     *
     * @param address
     */
    private _applyFormattedAddress;
    /**
     *
     * @returns
     */
    private _tryFindNewAddress;
    private _tryFindNewCoordinates;
    /**
     *
     * @param location
     */
    private _emitCoordinates;
    /**
     *
     * @param geometry
     */
    private _emitGeometry;
    /**
     *
     */
    private _popInvalidAddressMessage;
    /**
     *
     * @param autocomplete
     */
    private _setupGoogleAutocompleteOptions;
    /**
     *
     * @param place
     * @param useGeometryLatLng
     * @returns
     */
    private _applyNewPlaceOnTheMap;
    /**
     *
     * @param autocomplete
     */
    private _listenForGoogleAutocompleteAddressChanges;
    /**
     *
     * @param locationResult
     */
    private _gatherAddressInformation;
    private _removeGoogleAutocompleteApi;
    /**
     * Initializes the Google Autocomplete API on the specified DOM element.
     */
    private _initGoogleAutocompleteApi;
    /**
     *
     * @param country
     * @param city
     * @param address
     * @param address2
     * @param postcode
     */
    private _setFormLocationValues;
    static ɵfac: i0.ɵɵFactoryDeclaration<LocationFormComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<LocationFormComponent, "ga-location-form", never, { "form": { "alias": "form"; "required": false; }; "showAutocompleteSearch": { "alias": "showAutocompleteSearch"; "required": false; }; "showCoordinateInput": { "alias": "showCoordinateInput"; "required": false; }; }, { "mapCoordinatesEmitter": "mapCoordinatesEmitter"; "mapGeometryEmitter": "mapGeometryEmitter"; }, never, never, false, never>;
}
