import { OnInit, EventEmitter, OnDestroy, ElementRef, Renderer2 } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { NbThemeService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { ITag, ITagCreateInput } from '@gauzy/contracts';
import { Store, TagsService } from '@gauzy/ui-core/core';
import { PictureNameTagsComponent } from '../../table-components';
import * as i0 from "@angular/core";
export declare class TagsColorInputComponent extends PictureNameTagsComponent implements OnInit, OnDestroy {
    private readonly tagsService;
    private readonly store;
    readonly themeService: NbThemeService;
    readonly translateService: TranslateService;
    private readonly el;
    private readonly renderer;
    subject$: Subject<boolean>;
    hasAddTag$: Observable<boolean>;
    tags: ITag[];
    loading: boolean;
    private organization;
    _selectedTags: ITag[];
    get selectedTags(): ITag[];
    set selectedTags(value: ITag[]);
    _isOrgLevel: boolean;
    get isOrgLevel(): boolean;
    set isOrgLevel(value: boolean);
    _isTenantLevel: boolean;
    get isTenantLevel(): boolean;
    set isTenantLevel(value: boolean);
    _multiple: boolean;
    get multiple(): boolean;
    set multiple(value: boolean);
    _label: boolean;
    get label(): boolean;
    set label(value: boolean);
    _addTag: boolean;
    get addTag(): boolean;
    set addTag(value: boolean);
    selectedTagsEvent: EventEmitter<ITag[]>;
    selectedTagsOverflow: boolean;
    noOfTagsFits: number;
    onResize(): void;
    constructor(tagsService: TagsService, store: Store, themeService: NbThemeService, translateService: TranslateService, el: ElementRef, renderer: Renderer2);
    ngOnInit(): void;
    /**
     * Get tags by level
     *
     * @returns
     */
    getTagsByLevel(): Promise<void>;
    /**
     * Create new tag
     *
     * @param name
     * @returns
     */
    createNewTag: (name: ITagCreateInput["name"]) => Promise<ITag>;
    /**
     * Check if selected tags fits on the screen
     */
    private checkTagsFit;
    /**
     * Width of the trailing "+N" chip, measured with the classes it actually renders with.
     *
     * @param count the largest number the chip could have to show
     */
    private getOverflowLabelWidth;
    private getTagWidth;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TagsColorInputComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TagsColorInputComponent, "ga-tags-color-input", never, { "selectedTags": { "alias": "selectedTags"; "required": false; }; "isOrgLevel": { "alias": "isOrgLevel"; "required": false; }; "isTenantLevel": { "alias": "isTenantLevel"; "required": false; }; "multiple": { "alias": "multiple"; "required": false; }; "label": { "alias": "label"; "required": false; }; "addTag": { "alias": "addTag"; "required": false; }; }, { "selectedTagsEvent": "selectedTagsEvent"; }, never, never, false, never>;
}
