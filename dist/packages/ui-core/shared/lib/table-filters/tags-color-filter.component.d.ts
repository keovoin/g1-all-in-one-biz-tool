import { OnChanges, SimpleChanges } from '@angular/core';
import { DefaultFilter } from 'angular2-smart-table';
import { ITag } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class TagsColorFilterComponent extends DefaultFilter implements OnChanges {
    constructor();
    ngOnChanges(changes: SimpleChanges): void;
    /**
     *
     * @param tags
     */
    selectedTagsEvent(value: ITag[]): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TagsColorFilterComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TagsColorFilterComponent, "ga-tag-color-filter", never, {}, {}, never, never, false, never>;
}
