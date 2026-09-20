import { OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { NbDialogRef, NbThemeService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { ITag, ITagType } from '@gauzy/contracts';
import { Store, TagTypesService, ToastrService } from '@gauzy/ui-core/core';
import { TagsService } from '@gauzy/ui-core/core';
import { NotesWithTagsComponent } from '../table-components';
import * as i0 from "@angular/core";
export declare class TagsMutationComponent extends NotesWithTagsComponent implements OnInit {
    protected readonly dialogRef: NbDialogRef<TagsMutationComponent>;
    private readonly tagsService;
    private readonly tagTypeService;
    private readonly fb;
    readonly translateService: TranslateService;
    readonly themeService: NbThemeService;
    private readonly store;
    private readonly toastrService;
    /**
     * Tag mutation form
     */
    form: UntypedFormGroup;
    static buildForm(fb: UntypedFormBuilder): UntypedFormGroup;
    /**
     * List of tag types
     */
    tagTypes: ITagType[];
    _tag: ITag;
    get tag(): ITag;
    set tag(tag: ITag);
    /**
     * Getter fr
     * or color form control
     */
    get color(): any;
    constructor(dialogRef: NbDialogRef<TagsMutationComponent>, tagsService: TagsService, tagTypeService: TagTypesService, fb: UntypedFormBuilder, translateService: TranslateService, themeService: NbThemeService, store: Store, toastrService: ToastrService);
    ngOnInit(): void;
    /**
     * Fetch all tag types from the TagTypeService
     */
    private _loadTagTypes;
    addTag(): Promise<void>;
    editTag(): Promise<void>;
    closeDialog(tag?: ITag): Promise<void>;
    private _patchFormValue;
    /**
     * On changed color input
     *
     * @param color
     */
    onChangeColor(color: ITag['color']): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TagsMutationComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TagsMutationComponent, "ngx-tags-mutation", never, { "tag": { "alias": "tag"; "required": false; }; }, {}, never, never, false, never>;
}
