import { __decorate, __metadata } from "tslib";
import { Component, Input, EventEmitter, Output, ViewChild, ElementRef, Inject, Renderer2, ChangeDetectorRef, DOCUMENT } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { pick, isEmpty } from 'underscore';
import { environment as env } from '@gauzy/ui-config';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { CountryService } from '@gauzy/ui-core/core';
import { convertPrecisionFloatDigit } from '@gauzy/ui-core/common';
import { FormHelpers } from '../helpers';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "@gauzy/ui-core/core";
import * as i3 from "@angular/forms";
import * as i4 from "@nebular/theme";
import * as i5 from "../../modules/country/country.component";
let LocationFormComponent = class LocationFormComponent extends TranslationBaseComponent {
    get showAutocompleteSearch() {
        return this._showAutocompleteSearch;
    }
    set showAutocompleteSearch(val) {
        this._showAutocompleteSearch = val;
    }
    get showCoordinateInput() {
        return this._showCoordinateInput;
    }
    set showCoordinateInput(val) {
        this._showAutocompleteSearch = val;
    }
    /**
     *
     * @param fb
     * @returns
     */
    static buildForm(fb) {
        const form = fb.group({
            country: [],
            city: [],
            address: [],
            address2: [],
            postcode: [],
            loc: fb.group({
                type: ['Point'],
                coordinates: fb.array([null, null])
            })
        });
        return form;
    }
    constructor(translateService, countryService, cdr, _document, renderer) {
        super(translateService);
        this.translateService = translateService;
        this.countryService = countryService;
        this.cdr = cdr;
        this._document = _document;
        this.renderer = renderer;
        this.FormHelpers = FormHelpers;
        this.countries = [];
        /**
         *
         */
        this._showAutocompleteSearch = false;
        /**
         *
         */
        this._showCoordinateInput = true;
        //
        this.mapCoordinatesEmitter = new EventEmitter();
        //
        this.mapGeometryEmitter = new EventEmitter();
        this.countryService.countries$
            .pipe(untilDestroyed(this))
            .subscribe((countries) => (this.countries = countries));
    }
    ngAfterViewInit() {
        const { GOOGLE_PLACE_AUTOCOMPLETE, GOOGLE_MAPS_API_KEY } = env;
        if (!GOOGLE_PLACE_AUTOCOMPLETE || !GOOGLE_MAPS_API_KEY) {
            this.showAutocompleteSearch = false;
        }
        this.cdr.detectChanges();
        this._removeGoogleAutocompleteApi();
        this._initGoogleAutocompleteApi();
    }
    /**
     *
     */
    get countryControl() {
        return this.form.get('country');
    }
    /**
     *
     */
    get cityControl() {
        return this.form.get('city');
    }
    /**
     *
     */
    get addressControl() {
        return this.form.get('address');
    }
    /**
     *
     */
    get address2Control() {
        return this.form.get('address2');
    }
    /**
     *
     */
    get postcodeControl() {
        return this.form.get('postcode');
    }
    /**
     *
     */
    get coordinates() {
        return this.form.get('loc').get('coordinates');
    }
    /**
     *
     */
    onAddressChanges() {
        if (this.showAutocompleteSearch) {
            this._tryFindNewAddress();
        }
    }
    /**
     *
     */
    onCoordinatesChanged() {
        if (this.showAutocompleteSearch) {
            this._tryFindNewCoordinates();
        }
    }
    /**
     *
     * @returns
     */
    getValue() {
        const location = this.form.getRawValue();
        if (!location.postcode) {
            delete location.postcode;
        }
        return location;
    }
    /**
     *
     * @param geoLocation
     */
    setValue(geoLocation) {
        if (this.form.controls) {
            FormHelpers.deepMark(this.form, 'dirty');
        }
        this.form.setValue({
            postcode: geoLocation.postcode || '',
            ...pick(geoLocation, Object.keys(this.getValue()))
        });
        this.form.updateValueAndValidity();
        // This setup the form and map with new received values.
        this._tryFindNewCoordinates();
    }
    /**
     *
     */
    toggleShowCoordinates() {
        this.showCoordinates = !this.showCoordinates;
    }
    /**
     *
     */
    setDefaultCoords() {
        const lat = env.DEFAULT_LATITUDE;
        const lng = env.DEFAULT_LONGITUDE;
        if (lat && lng) {
            this.coordinates.setValue([lat, lng]);
            this.onCoordinatesChanged();
        }
    }
    /**
     *
     * @param address
     */
    _applyFormattedAddress(address) {
        if (this.searchElement) {
            this.searchElement.nativeElement.value = address;
        }
    }
    /**
     *
     * @returns
     */
    _tryFindNewAddress() {
        const { country, city, address, address2 } = this.form.value;
        if (isEmpty(address) || isEmpty(address2) || isEmpty(city) || isEmpty(country)) {
            return;
        }
        const newAddress = `${address}${address2}${city}${country}`;
        if (newAddress !== this._lastUsedAddressText) {
            this._lastUsedAddressText = newAddress;
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({
                address: `${address} ${address2}, ${city}`,
                componentRestrictions: {
                    country: country
                }
            }, (results, status) => {
                if (status === google.maps.GeocoderStatus.OK) {
                    const formattedAddress = results[0].formatted_address;
                    const place = results[0];
                    this._applyNewPlaceOnTheMap(place);
                    this._applyFormattedAddress(formattedAddress);
                }
            });
        }
    }
    _tryFindNewCoordinates() {
        const formCoordinates = this.coordinates.value;
        this._lat = formCoordinates[0];
        this._lng = formCoordinates[1];
        if (!this._lat || !this._lng) {
            return;
        }
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({
            location: { lng: this._lng, lat: this._lat }
        }, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK) {
                const formattedAddress = results[0].formatted_address;
                const place = results[0];
                const useGeometryLatLng = false;
                this._applyNewPlaceOnTheMap(place, useGeometryLatLng);
                this._applyFormattedAddress(formattedAddress);
            }
        });
    }
    /**
     *
     * @param location
     */
    _emitCoordinates(location) {
        this.mapCoordinatesEmitter.emit(location);
    }
    /**
     *
     * @param geometry
     */
    _emitGeometry(geometry) {
        this.mapGeometryEmitter.emit(geometry);
    }
    /**
     *
     */
    _popInvalidAddressMessage() { }
    /**
     *
     * @param autocomplete
     */
    _setupGoogleAutocompleteOptions(autocomplete) {
        autocomplete['setFields'](['address_components', 'geometry']);
    }
    /**
     *
     * @param place
     * @param useGeometryLatLng
     * @returns
     */
    _applyNewPlaceOnTheMap(place, useGeometryLatLng = true) {
        if (place.geometry === undefined || place.geometry === null) {
            this._popInvalidAddressMessage();
            return;
        }
        if (useGeometryLatLng) {
            const loc = place.geometry.location;
            this._lat = convertPrecisionFloatDigit(loc.lat());
            this._lng = convertPrecisionFloatDigit(loc.lng());
        }
        this.coordinates.setValue([this._lat, this._lng]);
        // If the place has a geometry, then present it on a map.
        this._emitGeometry(place.geometry);
        this._emitCoordinates(new google.maps.LatLng(this._lat, this._lng));
        this._gatherAddressInformation(place);
    }
    /**
     *
     * @param autocomplete
     */
    _listenForGoogleAutocompleteAddressChanges(autocomplete) {
        autocomplete.addListener('place_changed', (_) => {
            const place = autocomplete.getPlace();
            this._applyNewPlaceOnTheMap(place);
        });
    }
    /**
     *
     * @param locationResult
     */
    _gatherAddressInformation(locationResult) {
        const longName = 'long_name';
        const shortName = 'short_name';
        const neededAddressTypes = {
            country: shortName,
            locality: longName,
            // 'neighborhood' is not need for now
            // neighborhood: longName,
            route: longName,
            intersection: longName,
            street_number: longName,
            postal_code: longName,
            administrative_area_level_1: shortName,
            administrative_area_level_2: shortName,
            administrative_area_level_3: shortName,
            administrative_area_level_4: shortName,
            administrative_area_level_5: shortName
        };
        let addressInput = '';
        let address2Input = ''; // is house number also
        let country = '';
        let postcode = '';
        let city = '';
        locationResult.address_components.forEach((address) => {
            const addressType = address.types[0];
            const addressTypeKey = neededAddressTypes[addressType];
            const val = address[addressTypeKey];
            if (val) {
                switch (addressType) {
                    case 'country':
                        country = val;
                        break;
                    case 'locality':
                    case 'administrative_area_level_1':
                    case 'administrative_area_level_2':
                    case 'administrative_area_level_3':
                    case 'administrative_area_level_4':
                    case 'administrative_area_level_5':
                        if (city === '') {
                            city = val;
                        }
                        break;
                    case 'route':
                    case 'intersection':
                        if (addressInput === '') {
                            addressInput = val;
                        }
                        break;
                    case 'street_number':
                        address2Input = val;
                        break;
                    case 'postal_code':
                        postcode = val;
                        break;
                }
            }
        });
        this._setFormLocationValues(country, city, addressInput, address2Input, postcode);
    }
    /*
     * Removed multiple google place container before register new
     */
    _removeGoogleAutocompleteApi() {
        const body = this._document.body;
        const container = this._document.body.getElementsByClassName('pac-container');
        if (container.length > 0) {
            this.renderer.removeChild(body, container[0]);
        }
    }
    /**
     * Initializes the Google Autocomplete API on the specified DOM element.
     */
    _initGoogleAutocompleteApi() {
        if (this.searchElement) {
            const autocomplete = new google.maps.places.Autocomplete(this.searchElement.nativeElement);
            this._setupGoogleAutocompleteOptions(autocomplete);
            this._listenForGoogleAutocompleteAddressChanges(autocomplete);
        }
    }
    /**
     *
     * @param country
     * @param city
     * @param address
     * @param address2
     * @param postcode
     */
    _setFormLocationValues(country, city, address, address2, postcode) {
        if (!isEmpty(country)) {
            const find = this.countries.find((item) => item.isoCode === country);
            if (find) {
                this.country = find.isoCode;
                this.countryControl.setValue(this.country);
            }
        }
        if (!isEmpty(city)) {
            this.cityControl.setValue(city);
        }
        if (!isEmpty(postcode)) {
            this.postcodeControl.setValue(postcode);
        }
        if (!isEmpty(address)) {
            this.addressControl.setValue(address);
        }
        if (!isEmpty(address2)) {
            this.address2Control.setValue(address2);
        }
        this.coordinates.setValue([this._lat, this._lng]);
        this.form.updateValueAndValidity();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: LocationFormComponent, deps: [{ token: i1.TranslateService }, { token: i2.CountryService }, { token: i0.ChangeDetectorRef }, { token: DOCUMENT }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: LocationFormComponent, isStandalone: false, selector: "ga-location-form", inputs: { form: "form", showAutocompleteSearch: "showAutocompleteSearch", showCoordinateInput: "showCoordinateInput" }, outputs: { mapCoordinatesEmitter: "mapCoordinatesEmitter", mapGeometryEmitter: "mapGeometryEmitter" }, viewQueries: [{ propertyName: "searchElement", first: true, predicate: ["autocomplete"], descendants: true }], usesInheritance: true, ngImport: i0, template: "@if (form) {\n  <ng-container [formGroup]=\"form\">\n    <div class=\"fields\">\n      @if (showAutocompleteSearch) {\n        <div class=\"row\">\n          <div class=\"col-11\">\n            <div class=\"form-group\">\n              <label class=\"label\" for=\"findInput\">\n                {{ 'FORM.LABELS.FIND_ADDRESS' | translate }}\n              </label>\n              <nb-form-field>\n                <nb-icon\n                  icon-basic-color\n                  nbPrefix\n                  icon=\"search-outline\"\n                  pack=\"eva\"\n                ></nb-icon>\n                <input\n                  #autocomplete\n                  id=\"findInput\"\n                  fullWidth\n                  nbInput\n                  type=\"text\"\n                  class=\"form-control\"\n                  [placeholder]=\"'FORM.LABELS.FIND_ADDRESS' | translate\"\n                  />\n                </nb-form-field>\n              </div>\n            </div>\n          </div>\n        }\n        <ng-container>\n          <div class=\"row\">\n            <div class=\"col-8\">\n              <ga-country\n                formControlName=\"country\"\n                [formControl]=\"form.get('country')\"\n                (selectChange)=\"onAddressChanges()\"\n              ></ga-country>\n            </div>\n          </div>\n          <div class=\"row\">\n            <div class=\"col-8\">\n              <div class=\"form-group\">\n                <label class=\"label\" for=\"cityInput\">\n                  {{ 'FORM.LABELS.CITY' | translate }}\n                </label>\n                <input\n                  (blur)=\"onAddressChanges()\"\n                  fullWidth\n                  id=\"cityInput\"\n                  type=\"text\"\n                  nbInput\n                  formControlName=\"city\"\n                  [status]=\"FormHelpers.isInvalidControl(form, 'city') ? 'danger' :'basic'\"\n                  [placeholder]=\"'FORM.PLACEHOLDERS.CITY' | translate\"\n                  />\n                </div>\n              </div>\n            </div>\n            <div class=\"row\">\n              <div class=\"col-6\">\n                <div class=\"form-group\">\n                  <label class=\"label\" for=\"postcodeInput\">\n                    {{ 'FORM.LABELS.POSTCODE' | translate }}\n                  </label>\n                  <input\n                    (blur)=\"onAddressChanges()\"\n                    fullWidth\n                    id=\"postcodeInput\"\n                    type=\"text\"\n                    nbInput\n                    [status]=\"FormHelpers.isInvalidControl(form, 'postcode') ? 'danger' :'basic'\"\n                    formControlName=\"postcode\"\n                    [placeholder]=\"'FORM.PLACEHOLDERS.POSTCODE' | translate\"\n                    />\n                  </div>\n                </div>\n              </div>\n              <div class=\"row\">\n                <div class=\"col-11\">\n                  <div class=\"form-group\">\n                    <label class=\"label\" for=\"addressInput\">\n                      {{ 'FORM.LABELS.ADDRESS' | translate }}\n                    </label>\n                    <input\n                      (blur)=\"onAddressChanges()\"\n                      #address\n                      id=\"addressInput\"\n                      type=\"text\"\n                      nbInput\n                      fullWidth\n                      [status]=\"FormHelpers.isInvalidControl(form, 'address') ? 'danger' :'basic'\"\n                      formControlName=\"address\"\n                      [placeholder]=\"'FORM.PLACEHOLDERS.ADDRESS' | translate\"\n                      />\n                    </div>\n                  </div>\n                </div>\n                <div class=\"row\">\n                  <div class=\"col-11\">\n                    <div class=\"form-group\">\n                      <label class=\"label\" for=\"address2Input\">\n                        {{ 'FORM.LABELS.ADDRESS_2' | translate }}\n                      </label>\n                      <input\n                        (blur)=\"onAddressChanges()\"\n                        #address\n                        id=\"address2Input\"\n                        type=\"text\"\n                        nbInput\n                        fullWidth\n                        [status]=\"FormHelpers.isInvalidControl( form, 'address2' ) ? 'danger' :'basic'\"\n                        formControlName=\"address2\"\n                        [placeholder]=\"'FORM.PLACEHOLDERS.ADDRESS_2' | translate\"\n                        />\n                      </div>\n                    </div>\n                  </div>\n                  @if (showCoordinateInput) {\n                    <div class=\"row mb-2\">\n                      <div class=\"col-sm-11\">\n                        <nb-checkbox (checkedChange)=\"toggleShowCoordinates()\">\n                          {{ 'FORM.LABELS.COORDINATE.TITLE' | translate }}\n                        </nb-checkbox >\n                      </div>\n                    </div>\n                  }\n                </ng-container>\n                @if (showCoordinates) {\n                  <div class=\"row\" formGroupName=\"loc\">\n                    <ng-container formArrayName=\"coordinates\">\n                      <div class=\"col-sm-6\">\n                        <div class=\"form-group\">\n                          <label class=\"label\" for=\"postcodeInput\">\n                            {{ 'FORM.LABELS.COORDINATE.LATITUDE' | translate }}\n                          </label>\n                          <input\n                            (blur)=\"onCoordinatesChanged()\"\n                            fullWidth\n                            type=\"number\"\n                            nbInput\n                            [placeholder]=\"'FORM.PLACEHOLDERS.COORDINATE.LATITUDE' | translate\"\n                            formControlName=\"0\"\n                            step=\"0.1\"\n                            />\n                          </div>\n                        </div>\n                        <div class=\"col-sm-5\">\n                          <div class=\"form-group\">\n                            <label class=\"label\" for=\"postcodeInput\">\n                              {{ 'FORM.LABELS.COORDINATE.LONGITUDE' | translate }}\n                            </label>\n                            <input\n                              (blur)=\"onCoordinatesChanged()\"\n                              fullWidth\n                              type=\"number\"\n                              nbInput\n                              [placeholder]=\"'FORM.PLACEHOLDERS.COORDINATE.LONGITUDE' | translate\"\n                              formControlName=\"1\"\n                              step=\"0.1\"\n                              />\n                            </div>\n                          </div>\n                        </ng-container>\n                      </div>\n                    }\n                  </div>\n                </ng-container>\n              }\n", styles: ["::ng-deep .pac-container.pac-logo{z-index:1130!important;position:absolute!important}\n"], dependencies: [{ kind: "directive", type: i3.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i3.NumberValueAccessor, selector: "input[type=number][formControlName],input[type=number][formControl],input[type=number][ngModel]" }, { kind: "directive", type: i3.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i3.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],[formArray],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i3.FormControlDirective, selector: "[formControl]", inputs: ["formControl", "disabled", "ngModel"], outputs: ["ngModelChange"], exportAs: ["ngForm"] }, { kind: "directive", type: i3.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "directive", type: i3.FormControlName, selector: "[formControlName]", inputs: ["formControlName", "disabled", "ngModel"], outputs: ["ngModelChange"] }, { kind: "directive", type: i3.FormGroupName, selector: "[formGroupName]", inputs: ["formGroupName"] }, { kind: "directive", type: i3.FormArrayName, selector: "[formArrayName]", inputs: ["formArrayName"] }, { kind: "directive", type: i4.NbInputDirective, selector: "input[nbInput],textarea[nbInput]", inputs: ["fieldSize", "status", "shape", "fullWidth"] }, { kind: "component", type: i4.NbCheckboxComponent, selector: "nb-checkbox", inputs: ["checked", "disabled", "status", "indeterminate"], outputs: ["checkedChange"] }, { kind: "component", type: i4.NbFormFieldComponent, selector: "nb-form-field" }, { kind: "directive", type: i4.NbPrefixDirective, selector: "[nbPrefix]" }, { kind: "component", type: i4.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "component", type: i5.CountryComponent, selector: "ga-country", inputs: ["formControl", "country", "placeholder"], outputs: ["optionChange"] }, { kind: "pipe", type: i1.TranslatePipe, name: "translate" }] }); }
};
LocationFormComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [TranslateService,
        CountryService,
        ChangeDetectorRef,
        Document,
        Renderer2])
], LocationFormComponent);
export { LocationFormComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: LocationFormComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-location-form', standalone: false, template: "@if (form) {\n  <ng-container [formGroup]=\"form\">\n    <div class=\"fields\">\n      @if (showAutocompleteSearch) {\n        <div class=\"row\">\n          <div class=\"col-11\">\n            <div class=\"form-group\">\n              <label class=\"label\" for=\"findInput\">\n                {{ 'FORM.LABELS.FIND_ADDRESS' | translate }}\n              </label>\n              <nb-form-field>\n                <nb-icon\n                  icon-basic-color\n                  nbPrefix\n                  icon=\"search-outline\"\n                  pack=\"eva\"\n                ></nb-icon>\n                <input\n                  #autocomplete\n                  id=\"findInput\"\n                  fullWidth\n                  nbInput\n                  type=\"text\"\n                  class=\"form-control\"\n                  [placeholder]=\"'FORM.LABELS.FIND_ADDRESS' | translate\"\n                  />\n                </nb-form-field>\n              </div>\n            </div>\n          </div>\n        }\n        <ng-container>\n          <div class=\"row\">\n            <div class=\"col-8\">\n              <ga-country\n                formControlName=\"country\"\n                [formControl]=\"form.get('country')\"\n                (selectChange)=\"onAddressChanges()\"\n              ></ga-country>\n            </div>\n          </div>\n          <div class=\"row\">\n            <div class=\"col-8\">\n              <div class=\"form-group\">\n                <label class=\"label\" for=\"cityInput\">\n                  {{ 'FORM.LABELS.CITY' | translate }}\n                </label>\n                <input\n                  (blur)=\"onAddressChanges()\"\n                  fullWidth\n                  id=\"cityInput\"\n                  type=\"text\"\n                  nbInput\n                  formControlName=\"city\"\n                  [status]=\"FormHelpers.isInvalidControl(form, 'city') ? 'danger' :'basic'\"\n                  [placeholder]=\"'FORM.PLACEHOLDERS.CITY' | translate\"\n                  />\n                </div>\n              </div>\n            </div>\n            <div class=\"row\">\n              <div class=\"col-6\">\n                <div class=\"form-group\">\n                  <label class=\"label\" for=\"postcodeInput\">\n                    {{ 'FORM.LABELS.POSTCODE' | translate }}\n                  </label>\n                  <input\n                    (blur)=\"onAddressChanges()\"\n                    fullWidth\n                    id=\"postcodeInput\"\n                    type=\"text\"\n                    nbInput\n                    [status]=\"FormHelpers.isInvalidControl(form, 'postcode') ? 'danger' :'basic'\"\n                    formControlName=\"postcode\"\n                    [placeholder]=\"'FORM.PLACEHOLDERS.POSTCODE' | translate\"\n                    />\n                  </div>\n                </div>\n              </div>\n              <div class=\"row\">\n                <div class=\"col-11\">\n                  <div class=\"form-group\">\n                    <label class=\"label\" for=\"addressInput\">\n                      {{ 'FORM.LABELS.ADDRESS' | translate }}\n                    </label>\n                    <input\n                      (blur)=\"onAddressChanges()\"\n                      #address\n                      id=\"addressInput\"\n                      type=\"text\"\n                      nbInput\n                      fullWidth\n                      [status]=\"FormHelpers.isInvalidControl(form, 'address') ? 'danger' :'basic'\"\n                      formControlName=\"address\"\n                      [placeholder]=\"'FORM.PLACEHOLDERS.ADDRESS' | translate\"\n                      />\n                    </div>\n                  </div>\n                </div>\n                <div class=\"row\">\n                  <div class=\"col-11\">\n                    <div class=\"form-group\">\n                      <label class=\"label\" for=\"address2Input\">\n                        {{ 'FORM.LABELS.ADDRESS_2' | translate }}\n                      </label>\n                      <input\n                        (blur)=\"onAddressChanges()\"\n                        #address\n                        id=\"address2Input\"\n                        type=\"text\"\n                        nbInput\n                        fullWidth\n                        [status]=\"FormHelpers.isInvalidControl( form, 'address2' ) ? 'danger' :'basic'\"\n                        formControlName=\"address2\"\n                        [placeholder]=\"'FORM.PLACEHOLDERS.ADDRESS_2' | translate\"\n                        />\n                      </div>\n                    </div>\n                  </div>\n                  @if (showCoordinateInput) {\n                    <div class=\"row mb-2\">\n                      <div class=\"col-sm-11\">\n                        <nb-checkbox (checkedChange)=\"toggleShowCoordinates()\">\n                          {{ 'FORM.LABELS.COORDINATE.TITLE' | translate }}\n                        </nb-checkbox >\n                      </div>\n                    </div>\n                  }\n                </ng-container>\n                @if (showCoordinates) {\n                  <div class=\"row\" formGroupName=\"loc\">\n                    <ng-container formArrayName=\"coordinates\">\n                      <div class=\"col-sm-6\">\n                        <div class=\"form-group\">\n                          <label class=\"label\" for=\"postcodeInput\">\n                            {{ 'FORM.LABELS.COORDINATE.LATITUDE' | translate }}\n                          </label>\n                          <input\n                            (blur)=\"onCoordinatesChanged()\"\n                            fullWidth\n                            type=\"number\"\n                            nbInput\n                            [placeholder]=\"'FORM.PLACEHOLDERS.COORDINATE.LATITUDE' | translate\"\n                            formControlName=\"0\"\n                            step=\"0.1\"\n                            />\n                          </div>\n                        </div>\n                        <div class=\"col-sm-5\">\n                          <div class=\"form-group\">\n                            <label class=\"label\" for=\"postcodeInput\">\n                              {{ 'FORM.LABELS.COORDINATE.LONGITUDE' | translate }}\n                            </label>\n                            <input\n                              (blur)=\"onCoordinatesChanged()\"\n                              fullWidth\n                              type=\"number\"\n                              nbInput\n                              [placeholder]=\"'FORM.PLACEHOLDERS.COORDINATE.LONGITUDE' | translate\"\n                              formControlName=\"1\"\n                              step=\"0.1\"\n                              />\n                            </div>\n                          </div>\n                        </ng-container>\n                      </div>\n                    }\n                  </div>\n                </ng-container>\n              }\n", styles: ["::ng-deep .pac-container.pac-logo{z-index:1130!important;position:absolute!important}\n"] }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i2.CountryService }, { type: i0.ChangeDetectorRef }, { type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i0.Renderer2 }], propDecorators: { form: [{
                type: Input
            }], showAutocompleteSearch: [{
                type: Input
            }], showCoordinateInput: [{
                type: Input
            }], mapCoordinatesEmitter: [{
                type: Output
            }], mapGeometryEmitter: [{
                type: Output
            }], searchElement: [{
                type: ViewChild,
                args: ['autocomplete']
            }] } });
//# sourceMappingURL=location-form.component.js.map