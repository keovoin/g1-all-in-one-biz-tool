import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { icon, LatLng, latLng, marker, tileLayer } from 'leaflet';
import { environment } from '@gauzy/ui-config';
import { convertPrecisionFloatDigit } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@bluehalo/ngx-leaflet";
export class LeafletMapComponent {
    set zoom(val) {
        this._zoom = val;
        this.options.zoom = val;
    }
    get zoom() {
        return this._zoom || 12;
    }
    set icon(val) {
        this._icon = val;
    }
    get icon() {
        // `leafelt` is NOT a typo to fix — it is the real directory name on disk
        // (`apps/gauzy/src/assets/leafelt/`), copied verbatim into the build output.
        // A spelling pass "corrected" this once and every map marker 404'd, because
        // none of the seven `<ga-leaflet-map>` call sites binds `[icon]`, so this
        // default is always the one used. Rename the folder first if you want the
        // other spelling.
        return this._icon || 'assets/leafelt/marker-icon.png';
    }
    set marker(val) {
        this._marker = val;
        this.addMarker(this._marker);
    }
    get marker() {
        return this._marker;
    }
    constructor(cdr) {
        this.cdr = cdr;
        // Open Street Map definitions
        this.layer = tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: 'Open Street Map'
        });
        // Values to bind to Leaflet Directive
        this.options = {
            layers: [this.layer],
            zoom: this.zoom,
            center: latLng(environment.DEFAULT_LATITUDE, environment.DEFAULT_LONGITUDE)
        };
        this.markers = [];
        this.mapClicked = new EventEmitter();
        this.mapDoubleClicked = new EventEmitter();
    }
    ngAfterViewInit() {
        setTimeout(() => {
            this.loaded = true;
        }, 200);
        this.cdr.detectChanges();
    }
    /*
     * Map Zoom and Move: LeafletEvent
     */
    onMapReady(map) {
        this.map = map;
    }
    onMapMove(map) {
        // Do stuff with map
    }
    onMapMoveStart(map) {
        // Do stuff with map
    }
    onMapMoveEnd(map) {
        // Do stuff with map
    }
    onMapZoom(map) {
        // Do stuff with map
    }
    onMapZoomStart(map) {
        // Do stuff with map
    }
    onMapZoomEnd(map) {
        // Do stuff with map
    }
    /*
     * Mouse Interactions: LeafletMouseEvent
     */
    onMapClick(map) {
        const { lat, lng } = map.latlng;
        const latitude = convertPrecisionFloatDigit(lat);
        const longitude = convertPrecisionFloatDigit(lng);
        this.mapClicked.emit(new LatLng(latitude, longitude));
        this.addMarker(new LatLng(latitude, longitude));
    }
    onMapDoubleClick(map) {
        // Do stuff with map
    }
    onMapMouseDown(map) {
        // Do stuff with map
    }
    onMapMouseUp(map) {
        // Do stuff with map
    }
    onMapMouseMove(map) {
        // Do stuff with map
    }
    onMapMouseOver(map) {
        // Do stuff with map
    }
    onMapMouseOut(map) {
        // Do stuff with map
    }
    /**
     * Re-measures the map against its container.
     *
     * Leaflet caches the container size when the map is created, and the map is
     * created on a timer — a host whose layout is still settling (data arriving,
     * a panel above it growing) ends up with tiles sized for a box that no longer
     * exists. Callers that resize the map's box invoke this afterwards.
     */
    invalidateSize() {
        this.map?.invalidateSize();
    }
    /*
     * Add location marker after click on map
     */
    addMarker(latlng) {
        if (!this.map) {
            return;
        }
        const { lat, lng } = latlng;
        const newMarker = marker([lat, lng], {
            icon: icon({
                iconSize: [25, 41],
                iconAnchor: [13, 41],
                iconUrl: this.icon,
                tooltipAnchor: [0, -41]
            }),
            riseOnHover: true
        }).bindTooltip(`${lat},${lng}`, {
            permanent: true,
            opacity: 1,
            direction: 'top'
        });
        this.markers = [];
        this.markers.push(newMarker);
        this.map.panTo(new LatLng(lat, lng));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: LeafletMapComponent, deps: [{ token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: LeafletMapComponent, isStandalone: false, selector: "ga-leaflet-map", inputs: { zoom: "zoom", icon: "icon", marker: "marker" }, outputs: { mapClicked: "mapClicked", mapDoubleClicked: "mapDoubleClicked" }, ngImport: i0, template: "<div class=\"row mt-3 mb-3\">\n  <div class=\"col-12\">\n    @if (loaded) {\n      <div\n        leaflet\n        [(leafletZoom)]=\"zoom\"\n        [leafletOptions]=\"options\"\n        [leafletLayers]=\"markers\"\n        (leafletMapReady)=\"onMapReady($event)\"\n        (leafletMapMove)=\"onMapMove($event)\"\n        (leafletMapMoveStart)=\"onMapMoveStart($event)\"\n        (leafletMapMoveEnd)=\"onMapMoveEnd($event)\"\n        (leafletMapZoom)=\"onMapZoom($event)\"\n        (leafletMapZoomStart)=\"onMapZoomStart($event)\"\n        (leafletMapZoomEnd)=\"onMapZoomEnd($event)\"\n        (leafletClick)=\"onMapClick($event)\"\n        (leafletDoubleClick)=\"onMapDoubleClick($event)\"\n        (leafletMouseDown)=\"onMapMouseDown($event)\"\n        (leafletMouseUp)=\"onMapMouseUp($event)\"\n        (leafletMouseMove)=\"onMapMouseMove($event)\"\n        (leafletMouseOver)=\"onMapMouseOver($event)\"\n        (leafletMouseOut)=\"onMapMouseOut($event)\"\n      ></div>\n    }\n  </div>\n</div>\n", styles: ["::ng-deep .leaflet-container{width:100%!important;height:calc(100vh - 30rem)!important;position:relative!important;outline:none!important;border-radius:var(--border-radius)}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "directive", type: i1.LeafletDirective, selector: "[leaflet]", inputs: ["leafletFitBoundsOptions", "leafletPanOptions", "leafletZoomOptions", "leafletZoomPanOptions", "leafletOptions", "leafletZoom", "leafletCenter", "leafletFitBounds", "leafletMaxBounds", "leafletMinZoom", "leafletMaxZoom"], outputs: ["leafletMapReady", "leafletZoomChange", "leafletCenterChange", "leafletClick", "leafletDoubleClick", "leafletMouseDown", "leafletMouseUp", "leafletMouseMove", "leafletMouseOver", "leafletMouseOut", "leafletMapMove", "leafletMapMoveStart", "leafletMapMoveEnd", "leafletMapZoom", "leafletMapZoomStart", "leafletMapZoomEnd"] }, { kind: "directive", type: i1.LeafletLayersDirective, selector: "[leafletLayers]", inputs: ["leafletLayers"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: LeafletMapComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-leaflet-map', standalone: false, template: "<div class=\"row mt-3 mb-3\">\n  <div class=\"col-12\">\n    @if (loaded) {\n      <div\n        leaflet\n        [(leafletZoom)]=\"zoom\"\n        [leafletOptions]=\"options\"\n        [leafletLayers]=\"markers\"\n        (leafletMapReady)=\"onMapReady($event)\"\n        (leafletMapMove)=\"onMapMove($event)\"\n        (leafletMapMoveStart)=\"onMapMoveStart($event)\"\n        (leafletMapMoveEnd)=\"onMapMoveEnd($event)\"\n        (leafletMapZoom)=\"onMapZoom($event)\"\n        (leafletMapZoomStart)=\"onMapZoomStart($event)\"\n        (leafletMapZoomEnd)=\"onMapZoomEnd($event)\"\n        (leafletClick)=\"onMapClick($event)\"\n        (leafletDoubleClick)=\"onMapDoubleClick($event)\"\n        (leafletMouseDown)=\"onMapMouseDown($event)\"\n        (leafletMouseUp)=\"onMapMouseUp($event)\"\n        (leafletMouseMove)=\"onMapMouseMove($event)\"\n        (leafletMouseOver)=\"onMapMouseOver($event)\"\n        (leafletMouseOut)=\"onMapMouseOut($event)\"\n      ></div>\n    }\n  </div>\n</div>\n", styles: ["::ng-deep .leaflet-container{width:100%!important;height:calc(100vh - 30rem)!important;position:relative!important;outline:none!important;border-radius:var(--border-radius)}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i0.ChangeDetectorRef }], propDecorators: { zoom: [{
                type: Input
            }], icon: [{
                type: Input
            }], marker: [{
                type: Input
            }], mapClicked: [{
                type: Output
            }], mapDoubleClicked: [{
                type: Output
            }] } });
//# sourceMappingURL=leaflet.component.js.map