import { AfterViewInit, ChangeDetectorRef, EventEmitter } from '@angular/core';
import * as L from 'leaflet';
import { LatLng, Layer } from 'leaflet';
import * as i0 from "@angular/core";
export declare class LeafletMapComponent implements AfterViewInit {
    private readonly cdr;
    loaded: boolean;
    private _zoom;
    private _icon;
    private _marker;
    private map;
    layer: L.TileLayer;
    protected options: {
        layers: L.TileLayer[];
        zoom: number;
        center: L.LatLng;
    };
    markers: Layer[];
    set zoom(val: number);
    get zoom(): number;
    set icon(val: string);
    get icon(): string;
    set marker(val: LatLng);
    get marker(): LatLng;
    mapClicked: EventEmitter<L.LatLng>;
    mapDoubleClicked: EventEmitter<L.LatLng>;
    constructor(cdr: ChangeDetectorRef);
    ngAfterViewInit(): void;
    onMapReady(map: L.Map): void;
    onMapMove(map: any): void;
    onMapMoveStart(map: any): void;
    onMapMoveEnd(map: any): void;
    onMapZoom(map: any): void;
    onMapZoomStart(map: any): void;
    onMapZoomEnd(map: any): void;
    onMapClick(map: any): void;
    onMapDoubleClick(map: any): void;
    onMapMouseDown(map: any): void;
    onMapMouseUp(map: any): void;
    onMapMouseMove(map: any): void;
    onMapMouseOver(map: any): void;
    onMapMouseOut(map: any): void;
    /**
     * Re-measures the map against its container.
     *
     * Leaflet caches the container size when the map is created, and the map is
     * created on a timer — a host whose layout is still settling (data arriving,
     * a panel above it growing) ends up with tiles sized for a box that no longer
     * exists. Callers that resize the map's box invoke this afterwards.
     */
    invalidateSize(): void;
    addMarker(latlng: LatLng): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<LeafletMapComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<LeafletMapComponent, "ga-leaflet-map", never, { "zoom": { "alias": "zoom"; "required": false; }; "icon": { "alias": "icon"; "required": false; }; "marker": { "alias": "marker"; "required": false; }; }, { "mapClicked": "mapClicked"; "mapDoubleClicked": "mapDoubleClicked"; }, never, never, false, never>;
}
