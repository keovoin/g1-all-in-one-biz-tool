import { ComponentRef, OnDestroy, OnInit } from '@angular/core';
import { IEmployee, IScreenshot } from '@gauzy/contracts';
import { GalleryComponent } from './gallery.component';
import * as i0 from "@angular/core";
export interface GalleryItem {
    id?: string;
    thumbUrl: string;
    fullUrl: string;
    recordedAt?: Date;
    employeeId?: string;
    description?: IScreenshot['description'];
    isWorkRelated?: IScreenshot['isWorkRelated'];
}
export declare class GalleryDirective implements OnDestroy, OnInit {
    private readonly el;
    private readonly nbDialogService;
    private readonly galleryService;
    disableClick: boolean;
    dialogRef: ComponentRef<GalleryComponent>;
    items: GalleryItem[];
    item: GalleryItem;
    employeeId: IEmployee['id'];
    set disabled(value: any);
    /**
     * Host listener for click events
     */
    onClick(): void;
    ngOnInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<GalleryDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<GalleryDirective, "[ngxGallery]", never, { "items": { "alias": "items"; "required": false; }; "item": { "alias": "item"; "required": false; }; "employeeId": { "alias": "employeeId"; "required": false; }; "disabled": { "alias": "disabled"; "required": false; }; }, {}, never, never, true, never>;
}
