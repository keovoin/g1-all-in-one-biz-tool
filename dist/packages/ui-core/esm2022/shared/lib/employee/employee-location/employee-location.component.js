import { __decorate, __metadata } from "tslib";
import { Component, Input, ViewChild } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { filter, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { LatLng } from 'leaflet';
import { Store } from '@gauzy/ui-core/core';
import { CandidateStore, EmployeeStore } from '@gauzy/ui-core/core';
import { LeafletMapComponent, LocationFormComponent } from '../../forms';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
import * as i2 from "@gauzy/ui-core/core";
import * as i3 from "@nebular/theme";
import * as i4 from "../../forms/location/location-form.component";
import * as i5 from "../../forms/maps/leaflet/leaflet.component";
import * as i6 from "@ngx-translate/core";
let EmployeeLocationComponent = class EmployeeLocationComponent {
    constructor(fb, candidateStore, employeeStore, store) {
        this.fb = fb;
        this.candidateStore = candidateStore;
        this.employeeStore = employeeStore;
        this.store = store;
        this.form = LocationFormComponent.buildForm(this.fb);
    }
    ngOnInit() {
        this.employeeStore.selectedEmployee$
            .pipe(filter((employee) => !!employee), tap((employee) => (this.selectedEmployee = employee)), tap(() => this.setValidator()), tap((employee) => this._syncLocation(employee)), untilDestroyed(this))
            .subscribe();
        this.candidateStore.selectedCandidate$
            .pipe(filter((candidate) => !!candidate), tap((candidate) => (this.selectedCandidate = candidate)), tap(() => this.setValidator()), tap((candidate) => this._syncLocation(candidate)), untilDestroyed(this))
            .subscribe();
    }
    submitForm() {
        if (!this.store.selectedOrganization || this.form.invalid) {
            return;
        }
        const { tenantId } = this.store.user;
        const { id: organizationId } = this.store.selectedOrganization;
        const location = this.locationFormDirective.getValue();
        const { coordinates } = location['loc'];
        delete location['loc'];
        const [latitude, longitude] = coordinates;
        const contact = {
            ...{ organizationId, tenantId },
            ...location,
            ...{ latitude, longitude }
        };
        if (this.isCandidate) {
            this.candidateStore.candidateForm = {
                contact,
                organizationId
            };
        }
        if (this.isEmployee) {
            this.employeeStore.employeeForm = {
                contact,
                organizationId
            };
        }
    }
    //Initialize form
    _syncLocation(user) {
        if (!user.contact) {
            return;
        }
        setTimeout(() => {
            const { contact } = user;
            if (contact) {
                this.locationFormDirective.setValue({
                    country: contact.country,
                    city: contact.city,
                    postcode: contact.postcode,
                    address: contact.address,
                    address2: contact.address2,
                    loc: {
                        type: 'Point',
                        coordinates: [contact.latitude, contact.longitude]
                    }
                });
            }
        }, 200);
    }
    /*
     * Google Place and Leaflet Map Coordinates Changed Event Emitter
     */
    onCoordinatesChanges($event) {
        const { loc: { coordinates } } = this.locationFormDirective.getValue();
        const [lat, lng] = coordinates;
        this.leafletTemplate.addMarker(new LatLng(lat, lng));
    }
    /*
     * Leaflet Map Click Event Emitter
     */
    onMapClicked(latlng) {
        const { lat, lng } = latlng;
        const location = this.locationFormDirective.getValue();
        this.locationFormDirective.setValue({
            ...location,
            country: '',
            loc: {
                type: 'Point',
                coordinates: [lat, lng]
            }
        });
        this.locationFormDirective.onCoordinatesChanged();
    }
    setValidator() {
        if (!this.form) {
            return;
        }
        this.form.get('country').setValidators([Validators.required]);
        this.form.get('city').setValidators([Validators.required]);
        this.form.get('address').setValidators([Validators.required]);
        this.form.get('address2').setValidators([Validators.required]);
        this.form.get('postcode').setValidators([Validators.required]);
        this.form.updateValueAndValidity();
    }
    /*
     * Google Place Geometry Changed Event Emitter
     */
    onGeometrySend(geometry) { }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeLocationComponent, deps: [{ token: i1.UntypedFormBuilder }, { token: i2.CandidateStore }, { token: i2.EmployeeStore }, { token: i2.Store }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: EmployeeLocationComponent, isStandalone: false, selector: "ga-employee-location", inputs: { isEmployee: "isEmployee", isCandidate: "isCandidate" }, viewQueries: [{ propertyName: "locationFormDirective", first: true, predicate: ["locationFormDirective"], descendants: true }, { propertyName: "leafletTemplate", first: true, predicate: ["leafletTemplate"], descendants: true }], ngImport: i0, template: "<form class=\"location\" [formGroup]=\"form\">\n\t<section class=\"location__panel location__panel--form\">\n\t\t<div class=\"location__fields\">\n\t\t\t<ga-location-form\n\t\t\t\t#locationFormDirective\n\t\t\t\t[form]=\"form\"\n\t\t\t\t[showAutocompleteSearch]=\"true\"\n\t\t\t\t(mapCoordinatesEmitter)=\"onCoordinatesChanges($event)\"\n\t\t\t\t(mapGeometryEmitter)=\"onGeometrySend($event)\"\n\t\t\t></ga-location-form>\n\t\t</div>\n\n\t\t<footer class=\"location__actions\">\n\t\t\t<button\n\t\t\t\ttype=\"button\"\n\t\t\t\tnbButton\n\t\t\t\tstatus=\"success\"\n\t\t\t\t[disabled]=\"form.invalid\"\n\t\t\t\t(click)=\"submitForm()\"\n\t\t\t>\n\t\t\t\t{{ 'BUTTONS.SAVE' | translate }}\n\t\t\t</button>\n\t\t</footer>\n\t</section>\n\n\t<section class=\"location__panel location__panel--map\">\n\t\t<ga-leaflet-map #leafletTemplate (mapClicked)=\"onMapClicked($event)\"></ga-leaflet-map>\n\t</section>\n</form>\n", styles: [":host{display:flex;flex-direction:column;min-height:0}.location{display:flex;align-items:stretch;gap:1rem;padding:1rem;flex:1 1 auto;min-height:0}.location__panel{display:flex;flex-direction:column;min-width:0;min-height:0;background-color:var(--gauzy-card-3);border:1px solid var(--gauzy-border-default-color);border-radius:var(--border-radius)}.location__panel--form{flex:0 1 min(22rem,40%)}.location__panel--map{flex:1 1 auto;overflow:hidden;min-height:22rem}.location__fields{flex:1 1 auto;min-height:0;overflow-y:auto;padding:1.25rem}.location__actions{display:flex;justify-content:flex-end;gap:.75rem;padding:.875rem 1.25rem;border-top:1px solid var(--gauzy-border-default-color)}.location__actions button{min-width:7.5rem}:host ::ng-deep ga-location-form{display:block}:host ::ng-deep ga-location-form .row{margin-left:0;margin-right:0}:host ::ng-deep ga-location-form [class^=col-],:host ::ng-deep ga-location-form [class*=\" col-\"]{flex:0 0 100%;max-width:100%;padding-left:0;padding-right:0}:host ::ng-deep ga-location-form .row[formgroupname]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 .75rem}:host ::ng-deep ga-location-form .form-group{margin-bottom:1rem}:host ::ng-deep ga-location-form nb-checkbox{display:inline-flex;margin-bottom:1rem}:host ::ng-deep ga-location-form>.row:first-child{margin-bottom:1.25rem;padding-bottom:.25rem;border-bottom:1px solid var(--gauzy-border-default-color)}:host ::ng-deep ga-leaflet-map{display:flex;flex-direction:column;flex:1 1 auto;min-height:0}:host ::ng-deep ga-leaflet-map>.row{display:flex;flex:1 1 auto;min-height:0;margin:0}:host ::ng-deep ga-leaflet-map>.row>.col-12{display:flex;flex-direction:column;flex:1 1 auto;min-height:0;padding:0}:host ::ng-deep ga-leaflet-map .leaflet-container{flex:1 1 auto;height:auto!important;border-radius:0!important}@media only screen and (max-width:991px){.location{flex-direction:column}.location__panel--form{flex:0 0 auto}.location__panel--map{flex:0 0 22rem}}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "directive", type: i1.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { kind: "directive", type: i1.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],[formArray],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i1.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "component", type: i3.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i4.LocationFormComponent, selector: "ga-location-form", inputs: ["form", "showAutocompleteSearch", "showCoordinateInput"], outputs: ["mapCoordinatesEmitter", "mapGeometryEmitter"] }, { kind: "component", type: i5.LeafletMapComponent, selector: "ga-leaflet-map", inputs: ["zoom", "icon", "marker"], outputs: ["mapClicked", "mapDoubleClicked"] }, { kind: "pipe", type: i6.TranslatePipe, name: "translate" }] }); }
};
EmployeeLocationComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [UntypedFormBuilder,
        CandidateStore,
        EmployeeStore,
        Store])
], EmployeeLocationComponent);
export { EmployeeLocationComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeLocationComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-employee-location', standalone: false, template: "<form class=\"location\" [formGroup]=\"form\">\n\t<section class=\"location__panel location__panel--form\">\n\t\t<div class=\"location__fields\">\n\t\t\t<ga-location-form\n\t\t\t\t#locationFormDirective\n\t\t\t\t[form]=\"form\"\n\t\t\t\t[showAutocompleteSearch]=\"true\"\n\t\t\t\t(mapCoordinatesEmitter)=\"onCoordinatesChanges($event)\"\n\t\t\t\t(mapGeometryEmitter)=\"onGeometrySend($event)\"\n\t\t\t></ga-location-form>\n\t\t</div>\n\n\t\t<footer class=\"location__actions\">\n\t\t\t<button\n\t\t\t\ttype=\"button\"\n\t\t\t\tnbButton\n\t\t\t\tstatus=\"success\"\n\t\t\t\t[disabled]=\"form.invalid\"\n\t\t\t\t(click)=\"submitForm()\"\n\t\t\t>\n\t\t\t\t{{ 'BUTTONS.SAVE' | translate }}\n\t\t\t</button>\n\t\t</footer>\n\t</section>\n\n\t<section class=\"location__panel location__panel--map\">\n\t\t<ga-leaflet-map #leafletTemplate (mapClicked)=\"onMapClicked($event)\"></ga-leaflet-map>\n\t</section>\n</form>\n", styles: [":host{display:flex;flex-direction:column;min-height:0}.location{display:flex;align-items:stretch;gap:1rem;padding:1rem;flex:1 1 auto;min-height:0}.location__panel{display:flex;flex-direction:column;min-width:0;min-height:0;background-color:var(--gauzy-card-3);border:1px solid var(--gauzy-border-default-color);border-radius:var(--border-radius)}.location__panel--form{flex:0 1 min(22rem,40%)}.location__panel--map{flex:1 1 auto;overflow:hidden;min-height:22rem}.location__fields{flex:1 1 auto;min-height:0;overflow-y:auto;padding:1.25rem}.location__actions{display:flex;justify-content:flex-end;gap:.75rem;padding:.875rem 1.25rem;border-top:1px solid var(--gauzy-border-default-color)}.location__actions button{min-width:7.5rem}:host ::ng-deep ga-location-form{display:block}:host ::ng-deep ga-location-form .row{margin-left:0;margin-right:0}:host ::ng-deep ga-location-form [class^=col-],:host ::ng-deep ga-location-form [class*=\" col-\"]{flex:0 0 100%;max-width:100%;padding-left:0;padding-right:0}:host ::ng-deep ga-location-form .row[formgroupname]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 .75rem}:host ::ng-deep ga-location-form .form-group{margin-bottom:1rem}:host ::ng-deep ga-location-form nb-checkbox{display:inline-flex;margin-bottom:1rem}:host ::ng-deep ga-location-form>.row:first-child{margin-bottom:1.25rem;padding-bottom:.25rem;border-bottom:1px solid var(--gauzy-border-default-color)}:host ::ng-deep ga-leaflet-map{display:flex;flex-direction:column;flex:1 1 auto;min-height:0}:host ::ng-deep ga-leaflet-map>.row{display:flex;flex:1 1 auto;min-height:0;margin:0}:host ::ng-deep ga-leaflet-map>.row>.col-12{display:flex;flex-direction:column;flex:1 1 auto;min-height:0;padding:0}:host ::ng-deep ga-leaflet-map .leaflet-container{flex:1 1 auto;height:auto!important;border-radius:0!important}@media only screen and (max-width:991px){.location{flex-direction:column}.location__panel--form{flex:0 0 auto}.location__panel--map{flex:0 0 22rem}}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.UntypedFormBuilder }, { type: i2.CandidateStore }, { type: i2.EmployeeStore }, { type: i2.Store }], propDecorators: { isEmployee: [{
                type: Input
            }], isCandidate: [{
                type: Input
            }], locationFormDirective: [{
                type: ViewChild,
                args: ['locationFormDirective']
            }], leafletTemplate: [{
                type: ViewChild,
                args: ['leafletTemplate']
            }] } });
//# sourceMappingURL=employee-location.component.js.map